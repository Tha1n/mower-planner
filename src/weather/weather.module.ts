import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseModule } from '../database/database.module';
import { WeatherLog, WeatherLogSchema } from './models/dao/weather-log.dao';
import { WeatherDaoService } from './services/weather-dao.service';
import { WeatherService } from './services/weather.service';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    HttpModule,
    MongooseModule.forFeature([{ name: WeatherLog.name, schema: WeatherLogSchema }]),
  ],
  providers: [WeatherService, WeatherDaoService],
  exports: [WeatherService],
})
export class WeatherModule {}
