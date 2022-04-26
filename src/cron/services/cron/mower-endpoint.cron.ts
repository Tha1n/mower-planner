import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron } from '@nestjs/schedule';
import { CFG_WTHR_HUM_LVL, CFG_WTHR_RAIN_LVL } from '../../../assets/config.constants';
import { MOWER_CRON_DEFAULT_SETTING, MOWER_CRON_NAME } from '../../../assets/cron.constants';
import { MowerService } from '../../../mower/services/mower.service';
import { WeatherService } from '../../../weather/services/weather.service';
import { CronLoggingService } from '../cron-logging.service';

@Injectable()
export class MowerEndpointCron {
  private readonly _logger = new Logger(MowerEndpointCron.name);

  constructor(
    private readonly _config: ConfigService,
    private readonly _weatherService: WeatherService,
    private readonly _mowerService: MowerService,
    private _jobLoggingService: CronLoggingService,
  ) {}

  @Cron(MOWER_CRON_DEFAULT_SETTING, {
    name: MOWER_CRON_NAME,
    timeZone: 'Europe/Paris',
  })
  public async handleMowerSchedule() {
    // Start script
    this._logger.log('Mower Cron START.');
    this._jobLoggingService.initLoggingContext(MOWER_CRON_NAME);

    // Call Weather service to retrieve data
    let rainfallData: { humidity: number; rain: number } = undefined;
    try {
      rainfallData = await this._weatherService.getRainfallData();
    } catch (error) {
      this._jobLoggingService.error(`Unexpected error while retrieving weather data: <${error}>`);
    }

    if (rainfallData) {
      // We need to stop the mower schedule
      if (this.isWeatherRainy(rainfallData)) {
        this._logger.log('Weather is too rainy, need to stop mower.');
        await this.stopMower();
      } else {
        // We need to restore or let the actual mower schedule
        this._logger.log('Weather is not rainy, need to restore or let the actual schedule.');
        await this.resumeMower();
      }
    }
    this._jobLoggingService.completeLoggingContext(MOWER_CRON_NAME);
    this._logger.log('Mower Cron DONE.');
    // End of script
  }

  /**
   * Stop mower
   * @private
   * @return {*}  {Promise<void>}
   * @memberof MowerEndpointCron
   */
  private async stopMower(): Promise<void> {
    try {
      await this._mowerService.stopMower();
    } catch (error) {
      this._jobLoggingService.error(`Unexpected error while stopping mower: <${error}>`);
    }
  }

  /**
   * Resume mower planning
   * @private
   * @return {*}  {Promise<void>}
   * @memberof MowerEndpointCron
   */
  private async resumeMower(): Promise<void> {
    try {
      await this._mowerService.resumeScheduleMower();
    } catch (error) {
      this._jobLoggingService.error(`Unexpected error while stopping mower: <${error}>`);
    }
  }

  /**
   * Determine whether or not the weather is too rainy
   * @private
   * @param {{ humidity: number; rain: number }} rainfall
   * @return {*}  {boolean}
   * @memberof MowerEndpointCron
   */
  private isWeatherRainy(rainfall: { humidity: number; rain: number }): boolean {
    const humidityLevelReference: number = Number(this._config.get(CFG_WTHR_HUM_LVL));
    const maxRainReference: number = Number(this._config.get(CFG_WTHR_RAIN_LVL));

    this._logger.log(`Curr Humidity - ${rainfall.humidity} | Ref Humidity - ${humidityLevelReference}`);
    this._logger.log(`Curr Rain - ${rainfall.rain} | Ref Rain - ${maxRainReference}`);
    this._jobLoggingService.info(`Curr Humidity - ${rainfall.humidity} | Ref Humidity - ${humidityLevelReference}`);
    this._jobLoggingService.info(`Curr Rain - ${rainfall.rain} | Ref Rain - ${maxRainReference}`);

    return rainfall.humidity >= humidityLevelReference || rainfall.rain >= maxRainReference;
  }
}
