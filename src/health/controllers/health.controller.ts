import { Controller, Get, Logger } from '@nestjs/common';
import { HealthCheck, HealthCheckResult, HealthCheckService } from '@nestjs/terminus';
import { ConfigHealthIndicator } from '../services/config.health.service';

@Controller('health')
export class HealthController {
  private readonly _logger = new Logger(HealthController.name);

  constructor(private readonly _health: HealthCheckService, private _configHealthIndicator: ConfigHealthIndicator) {}

  @Get()
  @HealthCheck()
  async check(): Promise<HealthCheckResult> {
    this._logger.log('Checking app health.');
    return await this._health.check([() => this._configHealthIndicator.isHealthy()]);
  }
}
