import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosResponse } from 'axios';
import { Agent } from 'https';
import { firstValueFrom, map } from 'rxjs';
import { MowerAuthService } from './mower-auth.service';

// Specify service is Singleton (default behavior)
@Injectable({ scope: Scope.DEFAULT })
export class MowerService {
  private readonly _logger = new Logger(MowerService.name);

  constructor(
    private readonly _configService: ConfigService,
    private _authService: MowerAuthService,
    private readonly _http: HttpService,
  ) {
    this._logger.debug('Ctor');
  }

  public async stopMower(): Promise<void> {
    // TODO
    // Simple try: Get mower data
    const data = await firstValueFrom(
      this._http
        .get<any>(
          `${this._configService.get('HUSQ_API_ENDPOINT')}/mowers/${this._configService.get('HUSQ_MOWER_ID')}`,
          {
            httpsAgent: new Agent({ rejectUnauthorized: false }),
            headers: {
              'X-Api-Key': this._configService.get('HUSQ_APP_KEY'),
              Authorization: `Bearer ${await this._authService.getAuthToken()}`,
              'Authorization-Provider': 'husqvarna',
            },
          },
        )
        .pipe(
          map((axiosResponse: AxiosResponse): any => {
            return axiosResponse.data;
          }),
        ),
    );
    console.log(data);
  }

  public async restartMower(): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
