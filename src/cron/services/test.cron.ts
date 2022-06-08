import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { WeatherDaoService } from '../../weather/services/weather-dao.service';

@Injectable()
export class TestCron {
  private readonly _logger = new Logger(TestCron.name);

  constructor(private readonly _dao: WeatherDaoService) {}

  @Cron('* * * * *', {
    name: 'testCron',
    timeZone: 'Europe/Paris',
  })
  async test() {
    // Start script
    this._logger.log('Test Cron START.');

    const savedLog = await this._dao.saveLog({
      avgHumidity: 80,
      rain: 3.0,
    });
    this._logger.log(`New weather log added with id <${savedLog._id}>`);

    this._logger.log('Test Cron DONE.');
    // End of script
  }
}
