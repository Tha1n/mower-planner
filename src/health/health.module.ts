import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { CommonModule } from 'src/common/common.module';
import { HealthController } from './controllers/health.controller';
import { ConfigHealthIndicator } from './services/config.health.service';

@Module({
  imports: [CommonModule, TerminusModule],
  controllers: [HealthController],
  providers: [ConfigHealthIndicator],
})
export class HealthModule {}
