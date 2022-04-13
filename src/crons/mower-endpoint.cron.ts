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

  @Cron('0 0,12 * * *', {
    name: 'mowerCron',
    timeZone: 'Europe/Paris',
  })
  async handleMowerSchedule() {
    // Start script
    this._logger.log('Mower Cron START.');
    // Call Weather service to retrieve data
    const isWeatherRainy = await this._weatherService.isWeatherRainy();

    // We need to stop the mower schedule
    if (isWeatherRainy) {
      this._logger.log('Weather is too rainy, need to stop mower.');
      await this._mowerService.stopMower();
    } else {
      // We need to restore or let the actual mower schedule
      this._logger.log('Weather is not rainy, need to restore or let the actual schedule.');
      await this._mowerService.resumeScheduleMower();
    }
    this._logger.log('Mower Cron DONE.');
    // End of script
  }
}
