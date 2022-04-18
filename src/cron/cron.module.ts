import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { MowerModule } from '../mower/mower.module';
import { WeatherModule } from '../weather/weather.module';
import { MowerEndpointCron } from './services/mower-endpoint.cron';

@Module({
  imports: [ScheduleModule, WeatherModule, MowerModule],
  providers: [
    // Cron services
    MowerEndpointCron,
  ],
})
export class CronModule {}
