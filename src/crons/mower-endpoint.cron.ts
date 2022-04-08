import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { WeatherService } from 'src/services/weather.service';

@Injectable()
export class MowerEndpointCron {
  private readonly logger = new Logger(MowerEndpointCron.name);

  constructor(private readonly _weatherService: WeatherService) {}

  @Cron('45 * * * * *')
  handleRefresh() {
    this.logger.debug(
      'Called when the current second is 45. Only here for debug purpose.',
    );
  }

  @Cron('45 * * * * *', {
    name: 'mowerCron',
    timeZone: 'Europe/Paris',
  })
  async handleMowerSchedule() {
    // Call Weather service to retrieve data
    this.logger.debug('Calling weather service.');
    await this._weatherService.callWeather();
    // Get Robot state ? ==> See if needed
    // Decide whether or not we need to:
    // - Stop the robot schedule
    // - Restore robot schedule
    // End of script
  }
}
