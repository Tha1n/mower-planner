import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosResponse } from 'axios';
import { Agent } from 'https';
import { catchError, EMPTY, firstValueFrom, map, Observable } from 'rxjs';
import {
  CFG_WTHR_API_TOKEN,
  CFG_WTHR_API_URL,
  CFG_WTHR_FORECAST_NB,
  CFG_WTHR_HUM_LVL,
  CFG_WTHR_LAT,
  CFG_WTHR_LNG,
  CFG_WTHR_RAIN_LVL,
  CFG_WTHR_UNIT,
} from 'src/assets/config.constants';
import { Weather } from 'src/weather/models/weather';

@Injectable()
export class WeatherService {
  private readonly _logger = new Logger(WeatherService.name);

  constructor(private readonly _configService: ConfigService, private readonly _http: HttpService) {}

  public async isWeatherRainy(): Promise<boolean> {
    const humidityLevelReference: number = Number(this._configService.get(CFG_WTHR_HUM_LVL));
    const maxRainReference: number = Number(this._configService.get(CFG_WTHR_RAIN_LVL));

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
      .get<Weather>(this._configService.get(CFG_WTHR_API_URL), {
        params: {
          lat: this._configService.get(CFG_WTHR_LAT),
          lon: this._configService.get(CFG_WTHR_LNG),
          appid: this._configService.get(CFG_WTHR_API_TOKEN),
          units: this._configService.get(CFG_WTHR_UNIT),
          cnt: this._configService.get(CFG_WTHR_FORECAST_NB),
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
