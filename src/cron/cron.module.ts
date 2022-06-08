import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { MowerModule } from '../mower/mower.module';
import { WeatherModule } from '../weather/weather.module';
import { CronController } from './controllers/cron.controller';
import { MowerCron } from './services/mower-endpoint.cron';
import { WeatherCron } from './services/weather.cron';

@Module({
  imports: [ScheduleModule, WeatherModule, MowerModule],
  controllers: [CronController],
  providers: [
    // Cron services
    MowerCron,
    WeatherCron,
  ],
})
export class CronModule {}
