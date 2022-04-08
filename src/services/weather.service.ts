import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosResponse } from 'axios';
import { Agent } from 'https';
import { firstValueFrom, map, Observable } from 'rxjs';
import { Weather } from 'src/models/weather';

@Injectable()
export class WeatherService {
  constructor(
    private readonly _configService: ConfigService,
    private readonly _http: HttpService,
  ) {}

  // TODO Rename
  public async callWeather(): Promise<boolean> {
    let result = await this.getWeatherData();
    console.log(result);
    return true;
  }

  private getWeatherData(): Promise<Weather> {
    let $weather: Observable<AxiosResponse<Weather>> = this._http
      .get<Weather>(this._configService.get('WEATHER_API_ENDPOINT'), {
        params: {
          lat: this._configService.get('WEATHER_API_LAT'),
          lon: this._configService.get('WEATHER_API_LNG'),
          appid: this._configService.get('WEATHER_API_TOKEN'),
          units: this._configService.get('WEATHER_API_UNIT'),
          cnt: this._configService.get('WEATHER_API_FORECAST_NB'),
        },
        httpsAgent: new Agent({ rejectUnauthorized: false }),
      })
      .pipe(
        map((axiosResponse: AxiosResponse) => {
          return axiosResponse.data;
        }),
      );

    return firstValueFrom($weather, { defaultValue: undefined });
  }
}
