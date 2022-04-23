import { Controller, Get, Logger } from '@nestjs/common';
import { HealthCheck, HealthCheckResult, HealthCheckService } from '@nestjs/terminus';
import { ConfigHealthIndicator } from '../services/config.health.service';

@Controller('health')
export class HealthController {
  private readonly _logger = new Logger(HealthController.name);

  constructor(private readonly _health: HealthCheckService, private _configHealthIndicator: ConfigHealthIndicator) {}

  @Get('ready')
  @HealthCheck()
  ready(): string {
    this._logger.debug('Checking app readyness.');
    // App is always ready since no API path perform long treatment
    return 'READY';
  }

  @Get(['self', 'live'])
  @HealthCheck()
  async live(): Promise<HealthCheckResult> {
    this._logger.debug('Checking app liveness.');
    // Checking if configuration is efficient to enable app is start and alive
    return await this._health.check([() => this._configHealthIndicator.isHealthy()]);
  }
}
