import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { WEATHER_CRON_DEFAULT_SETTING, WEATHER_CRON_NAME } from '../../assets/cron.constants';
import { ShortForecast } from '../../weather/models/business/weather.business';
import { WeatherLog } from '../../weather/models/dao/weather-log.dao';
import { WeatherDaoService } from '../../weather/services/weather-dao.service';
import { WeatherService } from '../../weather/services/weather.service';

@Injectable()
export class WeatherCron {
  private readonly _logger = new Logger(WeatherCron.name);

  constructor(private readonly _service: WeatherService, private readonly _dao: WeatherDaoService) {}

  @Cron(WEATHER_CRON_DEFAULT_SETTING, {
    name: WEATHER_CRON_NAME,
    timeZone: 'Europe/Paris',
  })
  async saveWeatherData() {
    // Start script
    this._logger.log('Weather Cron START.');
    // Call Weather service to retrieve data
    const forecasts: ShortForecast[] = await this._service.getForecasts(6);
    this._logger.log(`${forecasts.length} forecasts retrieve.`);

    const log: WeatherLog = this._service.convertToLog(forecasts);

    const savedLog = await this._dao.saveLog(log);
    this._logger.log(`New weather log added with id <${savedLog._id}>`);

    this._logger.log('Weather Cron DONE.');
    // End of script
  }
}
