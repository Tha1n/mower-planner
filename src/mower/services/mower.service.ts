import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Agent } from 'https';
import { catchError, firstValueFrom, Observable } from 'rxjs';
import { CFG_MWR_API_URL, CFG_MWR_ID, CFG_MWR_KEY } from '../../assets/config.constants';
import { MowerActionsPayload, PAYLOAD_PARK, PAYLOAD_RESUME } from '../models/business/mower-actions-payload.business';
import { MowerAuthService } from './mower-auth.service';

@Injectable()
export class MowerService {
  private readonly _logger = new Logger(MowerService.name);

  constructor(
    private readonly _configService: ConfigService,
    private _authService: MowerAuthService,
    private readonly _http: HttpService,
  ) {}

  public async stopMower(): Promise<void> {
    const token = await this._authService.getAuthToken();

    this._logger.log('Stopping mower ...');
    // Sending action ParkUntilFurtherNotice
    await firstValueFrom(
      (
        await this.mowerActions$(PAYLOAD_PARK, token)
      ).pipe(
        catchError((err: any) => {
          this._logger.error(`Unexpected error when trying to stop mower: ${err}`);
          throw err;
        }),
      ),
    );
  }

  public async resumeScheduleMower(): Promise<void> {
    const token = await this._authService.getAuthToken();

    this._logger.log('Resume schedule of mower ...');
    // Sending action ParkUntilFurtherNotice
    await firstValueFrom(
      (
        await this.mowerActions$(PAYLOAD_RESUME, token)
      ).pipe(
        catchError((err: any) => {
          this._logger.error(`Unexpected error when trying to resume schedule of mower: ${err}`);
          throw err;
        }),
      ),
    );
  }

  private async mowerActions$(payload: MowerActionsPayload, token: string): Promise<Observable<any>> {
    return this._http.post<any>(
      `${this._configService.get(CFG_MWR_API_URL)}/mowers/${this._configService.get(CFG_MWR_ID)}/actions`,
      payload,
      {
        httpsAgent: new Agent({ rejectUnauthorized: false }),
        headers: {
          'Authorization-Provider': 'husqvarna',
          Authorization: `Bearer ${token}`,
          'X-Api-Key': `${this._configService.get(CFG_MWR_KEY)}`,
          'Content-Type': 'application/vnd.api+json',
        },
      },
    );
  }
}
