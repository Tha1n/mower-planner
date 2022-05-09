import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AxiosResponse } from 'axios';
import { Agent } from 'https';
import { catchError, firstValueFrom, map, Observable } from 'rxjs';
import { URLSearchParams } from 'url';
import { CFG_MWR_AUTH_API_URL, CFG_MWR_KEY, CFG_MWR_PWD, CFG_MWR_USR } from '../../assets/config.constants';
import { MowerAuthResponse } from '../models/business/auth-response.business';

// Specify service is Singleton (default behavior)
@Injectable({ scope: Scope.DEFAULT })
export class MowerAuthService {
  private readonly _logger = new Logger(MowerAuthService.name);
  private _token: string;
  private _refreshToken: string;

  constructor(
    private readonly _configService: ConfigService,
    private readonly _http: HttpService,
    private readonly _jwtService: JwtService,
  ) {
    this._token = '';
    this._refreshToken = '';
  }

  public async getAuthToken(): Promise<string> {
    // I have a token but it is expired
    if (this.isTokenExists() && (await this.isTokenExpired())) {
      this._logger.log('Token expired, refresh it.');
      await this.refreshToken();
    } else if (!this.isTokenExists()) {
      // No token, we need to retrieve it
      this._logger.log('No token, retrieve it.');
      await this.getToken();
    }

    // Ceintures bretelles pour trouver la root cause d'un bug récurrent de token ...
    if (!this.isTokenExists()) {
      this._logger.error(
        `Something went wrong when retrieving token or refreshing it ! Throwing error to ensure not using it.`,
      );
      throw new Error(`No token available to call mower services !`);
    }

    // Return token
    return this._token;
  }

  /**
   * Retrieve token from external API and store it
   */
  private async getToken(): Promise<void> {
    const params = new URLSearchParams();
    params.set('grant_type', 'password');
    params.set('client_id', this._configService.get(CFG_MWR_KEY));
    params.set('username', this._configService.get(CFG_MWR_USR));
    params.set('password', this._configService.get(CFG_MWR_PWD));

    const authData: MowerAuthResponse = await firstValueFrom(
      this.authenticateApi$(params).pipe(
        catchError((err: any) => {
          this._logger.error(`The following error occured when getting access_token: ${err}`);
          this.onError();
          throw err;
        }),
      ),
    );
    this._token = authData.access_token;
    this._refreshToken = authData.refresh_token;
  }

  private async refreshToken(): Promise<void> {
    const params = new URLSearchParams();
    params.set('grant_type', 'refresh_token');
    params.set('client_id', this._configService.get(CFG_MWR_KEY));
    params.set('refresh_token', this._refreshToken);

    const authData: MowerAuthResponse = await firstValueFrom(
      this.authenticateApi$(params).pipe(
        catchError((err: any) => {
          this._logger.error(`The following error occured when trying to refresh token: ${err}`);
          this.onError();
          throw err;
        }),
      ),
    );
    this._token = authData.access_token;
    this._refreshToken = authData.refresh_token;
  }

  private authenticateApi$(params: URLSearchParams): Observable<MowerAuthResponse> {
    return this._http
      .post<MowerAuthResponse>(`${this._configService.get(CFG_MWR_AUTH_API_URL)}/oauth2/token`, params, {
        httpsAgent: new Agent({ rejectUnauthorized: false }),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: 'application/json',
        },
      })
      .pipe(
        map((axiosResponse: AxiosResponse): MowerAuthResponse => {
          return axiosResponse.data as MowerAuthResponse;
        }),
        catchError((e) => {
          // Simply clear tokens before rethrow err
          this.onError();
          throw e;
        }),
      );
  }

  /**
   * Check if token is expired
   * @returns true if expired, false otherwise
   */
  private async isTokenExpired(): Promise<boolean> {
    try {
      await this._jwtService.verifyAsync(this._token);
    } catch (error) {
      if (error.name === 'TokenExpiredError') return true;
    }

    return false;
  }

  private isTokenExists(): boolean {
    return !!this._token;
  }

  /**
   * Clear local data on error
   * @private
   * @memberof MowerAuthService
   */
  private onError(): void {
    this._token = '';
    this._refreshToken = '';
  }
}
