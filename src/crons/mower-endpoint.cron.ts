import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { MowerService } from 'src/services/mower/mower.service';
import { WeatherService } from 'src/services/weather.service';

@Injectable()
export class MowerEndpointCron {
  private readonly _logger = new Logger(MowerEndpointCron.name);

  constructor(private readonly _weatherService: WeatherService, private readonly _mowerService: MowerService) {
    this._logger.debug('Ctor');
  }

  @Cron('0,15,30,45 * * * * *')
  handleRefresh() {
    this._logger.debug('Called every 15 second. Only here for debug purpose.');
  }

  // The future cron will be: 0 0,12 * * *
  @Cron('* * * * *', {
    name: 'mowerCron',
    timeZone: 'Europe/Paris',
  })
  async handleMowerSchedule() {
    // Start script
    // Call Weather service to retrieve data
    const isWeatherRainy = await this._weatherService.isWeatherRainy();

    // We need to stop the mower schedule
    if (isWeatherRainy) {
      this._logger.log('Weather is too rainy, we need to stop mower.');
      await this._mowerService.stopMower();
    } else {
      // We need to restore or let the actual mower schedule
      this._logger.log('Weather is not rainy, we need to restore or let the actual schedule.');
      await this._mowerService.restartMower();
    }
    // End of script
  }
}
