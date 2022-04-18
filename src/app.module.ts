import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { CronModule } from './cron/cron.module';
import { HealthModule } from './health/health.module';
import { MetadataModule } from './metadata/metadata.module';
import { MowerModule } from './mower/mower.module';
import { WeatherModule } from './weather/weather.module';

@Module({
  imports: [CommonModule, MetadataModule, HealthModule, WeatherModule, MowerModule, CronModule],
})
export class AppModule {}
