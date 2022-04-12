import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ScheduleModule } from '@nestjs/schedule';
import { MetadataController } from './controllers/metadata.controller';
import { MowerEndpointCron } from './crons/mower-endpoint.cron';
import { MowerAuthService } from './services/mower/mower-auth.service';
import { MowerService } from './services/mower/mower.service';
import { WeatherService } from './services/weather.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['config/config.local.env', 'config/config.env'],
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    HttpModule,
    JwtModule.register({}), // No config since we do not encode token here
  ],
  controllers: [MetadataController],
  providers: [
    // Cron services
    MowerEndpointCron,
    // Classic services
    WeatherService,
    MowerAuthService,
    MowerService,
  ],
})
export class AppModule {}
