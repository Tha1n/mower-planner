import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { MetadataController } from './controllers/metadata.controller';
import { MowerEndpointCron } from './crons/mower-endpoint.cron';
import { WeatherService } from './services/weather.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['config/config.local.env', 'config/config.env'],
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    HttpModule,
  ],
  controllers: [MetadataController],
  providers: [
    // Cron services
    MowerEndpointCron,
    // Classic services
    WeatherService,
  ],
})
export class AppModule {}
