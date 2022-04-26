import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { DatabaseModule } from '../database/database.module';
import { MowerModule } from '../mower/mower.module';
import { WeatherModule } from '../weather/weather.module';
import { CronController } from './controllers/cron.controller';
import { JobLog, JobLogSchema } from './models/dao/job-log.dao';
import { MowerEndpointCron } from './services/cron/mower-endpoint.cron';
import { JobLoggingService } from './services/job-logging.service';

@Module({
  imports: [
    ScheduleModule,
    WeatherModule,
    MowerModule,
    DatabaseModule,
    MongooseModule.forFeature([{ name: JobLog.name, schema: JobLogSchema }]),
  ],
  controllers: [CronController],
  providers: [
    // Cron services
    MowerEndpointCron,
    // Other services
    JobLoggingService,
  ],
})
export class CronModule {}
