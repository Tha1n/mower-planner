import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosResponse } from 'axios';
import { Agent } from 'https';
import { catchError, firstValueFrom, map, Observable } from 'rxjs';
import {
  CFG_WTHR_API_TOKEN,
  CFG_WTHR_API_URL,
  CFG_WTHR_FORECAST_NB,
  CFG_WTHR_LAT,
  CFG_WTHR_LNG,
  CFG_WTHR_UNIT,
} from '../../assets/config.constants';
import { Weather } from '../models/business/weather.business';

@Injectable()
export class WeatherService {
  private readonly _logger = new Logger(WeatherService.name);

  constructor(private readonly _configService: ConfigService, private readonly _http: HttpService) {}

  public async getRainfallData(): Promise<{ humidity: number; rain: number }> {
    let weatherData: Weather = await this.getWeatherData();
    let maxHumidity = 0;
    let maxRain = 0;
    for (const forecast of weatherData.list) {
      // Search the highest humidity level
      if (forecast.main.humidity > maxHumidity) maxHumidity = forecast.main.humidity;
      // Add rain level for each forecast (possibly undefined then test it)
      maxRain += forecast?.rain?.['3h'] ?? 0;
    }

    return { humidity: maxHumidity, rain: maxRain };
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
          throw err; // Rethrow error to ensure caller will detect an error event
        }),
      );

    return firstValueFrom($weather, { defaultValue: undefined });
  }
}
