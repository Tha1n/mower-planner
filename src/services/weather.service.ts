import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosResponse } from 'axios';
import { Agent } from 'https';
import { catchError, EMPTY, firstValueFrom, map, Observable } from 'rxjs';
import { Weather } from 'src/models/weather';

@Injectable()
export class WeatherService {
  private readonly _logger = new Logger(WeatherService.name);

  constructor(private readonly _configService: ConfigService, private readonly _http: HttpService) {
    this._logger.debug('Ctor');
  }

  public async isWeatherRainy(): Promise<boolean> {
    const humidityLevelReference: number = Number(this._configService.get('MAX_HUMIDITY_LEVEL'));
    const maxRainReference: number = Number(this._configService.get('MAX_RAIN_LEVEL'));

    let weatherData: Weather = await this.getWeatherData();
    let maxHumidity = 0;
    let maxRain = 0;
    for (const forecast of weatherData.list) {
      // Search the highest humidity level
      if (forecast.main.humidity > maxHumidity) maxHumidity = forecast.main.humidity;
      // Add rain level for each forecast (possibly undefined then test it)
      maxRain += forecast?.rain?.['3h'] ?? 0;
    }

    this._logger.debug(`Curr Humidity - ${maxHumidity} | Ref Humidity - ${humidityLevelReference}`);
    this._logger.debug(`Curr Rain - ${maxRain} | Ref Rain - ${maxRainReference}`);
    return maxHumidity >= humidityLevelReference || maxRain >= maxRainReference;
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
        catchError((err: any) => {
          this._logger.error(`The following error occured when calling weather service: ${err}`);
          return EMPTY;
        }),
      );

    return firstValueFrom($weather, { defaultValue: undefined });
  }
}
