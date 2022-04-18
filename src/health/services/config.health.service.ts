import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HealthCheckError, HealthIndicator, HealthIndicatorResult } from '@nestjs/terminus';
import {
  CFG_MWR_ID,
  CFG_MWR_KEY,
  CFG_MWR_PWD,
  CFG_MWR_SECRET,
  CFG_MWR_USR,
  CFG_WTHR_API_TOKEN,
  CFG_WTHR_LAT,
  CFG_WTHR_LNG,
} from 'src/assets/config.constants';

@Injectable()
export class ConfigHealthIndicator extends HealthIndicator {
  constructor(private readonly _config: ConfigService) {
    super();
  }
  private _keyToCheck: string[] = [
    CFG_WTHR_API_TOKEN,
    CFG_WTHR_LAT,
    CFG_WTHR_LNG,
    CFG_MWR_KEY,
    CFG_MWR_SECRET,
    CFG_MWR_USR,
    CFG_MWR_PWD,
    CFG_MWR_ID,
  ];

  async isHealthy(): Promise<HealthIndicatorResult> {
    const check = this.checkConfig();
    const result = this.getStatus(ConfigHealthIndicator.name, check.isHealthy, { 'missing-keys': check.data });

    if (check.isHealthy) {
      return result;
    }
    throw new HealthCheckError('Configuration check failed', result);
  }

  private checkConfig(): { isHealthy: boolean; data: string[] } {
    let result: { isHealthy: boolean; data: string[] } = { isHealthy: true, data: [] };

    for (const key of this._keyToCheck) {
      const isKeyHealthy = !!this._config.get(key);

      if (!isKeyHealthy) {
        result = {
          isHealthy: false,
          data: [...result.data, `${key} is not defined in config. Please fix it before run app !`],
        };
      }
    }

    return result;
  }
}
