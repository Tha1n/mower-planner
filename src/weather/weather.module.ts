import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WeatherService } from './services/weather.service';

@Module({
  imports: [ConfigModule, HttpModule],
  providers: [WeatherService],
  exports: [WeatherService],
})
export class WeatherModule {}
