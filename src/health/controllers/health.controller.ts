import { Controller, Get, Logger } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { HealthCheck, HealthCheckResult, HealthCheckService } from '@nestjs/terminus';
import { HEALTH_LIVE_ROUTE, HEALTH_READY_ROUTE, HEALTH_ROUTE, HEALTH_SELF_ROUTE } from '../../assets/route.constants';
import { HEALTH_API_TAG } from '../../assets/swagger.constants';
import { ConfigHealthIndicator } from '../services/config.health.service';

@ApiTags(HEALTH_API_TAG)
@Controller(HEALTH_ROUTE)
export class HealthController {
  private readonly _logger = new Logger(HealthController.name);
  private readonly READY: string = 'READY';

  constructor(private readonly _health: HealthCheckService, private _configHealthIndicator: ConfigHealthIndicator) {}

  @Get(HEALTH_READY_ROUTE)
  @ApiOkResponse({
    description: 'Indicates whether or not service is ready to receive requests.',
    type: String,
  })
  ready(): string {
    this._logger.verbose('Checking app readyness.');
    // App is always ready since no API path perform long treatment
    return 'READY';
  }

  @Get([HEALTH_SELF_ROUTE, HEALTH_LIVE_ROUTE])
  @HealthCheck()
  async live(): Promise<HealthCheckResult> {
    this._logger.verbose('Checking app liveness.');
    // Checking if configuration is efficient to enable app is start and alive
    return await this._health.check([() => this._configHealthIndicator.isHealthy()]);
  }
}
