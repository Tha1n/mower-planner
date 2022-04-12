import { HttpService } from '@nestjs/axios';
import { Injectable, Logger, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { AxiosResponse } from 'axios';
import { Agent } from 'https';
import { catchError, EMPTY, firstValueFrom, map, Observable } from 'rxjs';
import { MowerAuthResponse } from 'src/models/mower/auth-response';
import { URLSearchParams } from 'url';

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
    this._logger.debug('Ctor');

    this._token = '';
    this._refreshToken = '';
  }

  public async getAuthToken(): Promise<string> {
    // No token, we need to retrieve it
    if (!this._token) {
      this._logger.log('No token, retrieve it.');
      await this.getToken();
    } else if (await this.isTokenExpired()) {
      this._logger.log('Token expired, refresh it.');
      // If token expired, refresh it
      await this.refreshToken();
    }

    // Return token
    return this._token;
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

  /**
   * Retrieve token from external API and store it
   */
  private async getToken(): Promise<void> {
    const params = new URLSearchParams();
    params.set('grant_type', 'password');
    params.set('client_id', this._configService.get('HUSQ_APP_KEY'));
    params.set('username', this._configService.get('HUSQ_USER'));
    params.set('password', this._configService.get('HUSQ_PWD'));

    const authData: MowerAuthResponse = await firstValueFrom(
      this.authApiCall$(params).pipe(
        catchError((err: any) => {
          this._logger.error(`The following error occured when getting access_token: ${err}`);
          return EMPTY;
        }),
      ),
    );
    this._token = authData.access_token;
    this._refreshToken = authData.refresh_token;
  }

  private async refreshToken(): Promise<void> {
    const params = new URLSearchParams();
    params.set('grant_type', 'refresh_token');
    params.set('client_id', this._configService.get('HUSQ_APP_KEY'));
    params.set('refresh_token', this._refreshToken);

    const authData: MowerAuthResponse = await firstValueFrom(
      this.authApiCall$(params).pipe(
        catchError((err: any) => {
          this._logger.error(`The following error occured when trying to refresh token: ${err}`);
          return EMPTY;
        }),
      ),
    );
    this._token = authData.access_token;
    this._refreshToken = authData.refresh_token;
  }

  private authApiCall$(params: URLSearchParams): Observable<MowerAuthResponse> {
    return this._http
      .post<MowerAuthResponse>(`${this._configService.get('HUSQ_AUTH_API_ENDPOINT')}/oauth2/token`, params, {
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
          this._token = '';
          this._refreshToken = '';
          throw e;
        }),
      );
  }
}
