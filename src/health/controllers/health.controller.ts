import { Controller, Get, Logger } from '@nestjs/common';
import { HealthCheck, HealthCheckResult, HealthCheckService } from '@nestjs/terminus';
import { ConfigHealthIndicator } from '../services/config.health.service';

@Controller('health')
export class HealthController {
  private readonly _logger = new Logger(HealthController.name);

  constructor(private readonly _health: HealthCheckService, private _configHealthIndicator: ConfigHealthIndicator) {}

  @Get('ready')
  @HealthCheck()
  async ready(): Promise<HealthCheckResult> {
    this._logger.log('Checking app readyness.');
    // Checking if configuration is efficient to enable app is ready
    return await this._health.check([() => this._configHealthIndicator.isHealthy()]);
  }

  @Get('live')
  @HealthCheck()
  live(): string {
    this._logger.log('Checking app liveness.');
    // Checking app liveness (DB connection, third-parties services, etc.). But here it will be always alive
    return 'LIVE';
  }
}
