import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosResponse } from 'axios';
import { Agent } from 'https';
import { catchError, EMPTY, firstValueFrom, map, Observable } from 'rxjs';
import {
  CFG_WTHR_API_TOKEN,
  CFG_WTHR_API_URL,
  CFG_WTHR_HUM_LVL,
  CFG_WTHR_LAT,
  CFG_WTHR_LNG,
  CFG_WTHR_RAIN_LVL,
} from '../../assets/config.constants';
import { ShortForecast, Weather } from '../models/business/weather.business';
import { WeatherLog } from '../models/dao/weather-log.dao';
import { WeatherDaoService } from './weather-dao.service';

@Injectable()
export class WeatherService {
  private readonly _logger = new Logger(WeatherService.name);

  constructor(
    private readonly _configService: ConfigService,
    private readonly _http: HttpService,
    private readonly dao: WeatherDaoService,
  ) {}

  /**
   * Determine wether or not the weather is rainy or contains too much humidity
   * @return {*}  {Promise<boolean>}
   * @memberof WeatherService
   */
  public async isWeatherRainy(): Promise<boolean> {
    const humidityLevelReference: number = Number(this._configService.get(CFG_WTHR_HUM_LVL));
    const maxRainReference: number = Number(this._configService.get(CFG_WTHR_RAIN_LVL));

    // Retrieve logs from DB
    const logs: WeatherLog[] = await this.dao.getLastLogs(2);
    const lastLog = logs[0];

    // Check rainfall
    this._logger.log(`Curr Rain - ${lastLog.rain} | Ref Rain - ${maxRainReference}`);
    if (lastLog.rain >= maxRainReference) {
      return true;
    }

    // If rainfall is OK, check humidity average levels
    const avgHumidityLevel: number =
      logs.map((l: WeatherLog) => l.avgHumidity).reduce((prev, curr) => prev + curr, 0) / logs.length;
    this._logger.log(`Avg Humidity - ${avgHumidityLevel} | Ref Avg Humidity - ${humidityLevelReference}`);
    if (avgHumidityLevel >= humidityLevelReference) {
      return true;
    }

    return false;
  }

  /**
   * Convert forecast list to unique Weather Log (sum or average computed here)
   * @param {ShortForecast[]} forecasts Forecast list
   * @return {*}  {WeatherLog} The log matching input data
   * @memberof WeatherService
   */
  public convertToLog(forecasts: ShortForecast[]): WeatherLog {
    // Simple loop to sum up rainfall and humidity (to compute avg humidity further)
    // Better than using map/reduce
    let sumHumid: number = 0;
    let sumRain: number = 0;
    for (const forecast of forecasts) {
      sumRain += forecast?.rain?.['3h'] ?? 0;
      sumHumid += forecast.main.humidity;
    }

    return {
      date: new Date(),
      avgHumidity: Math.round((sumHumid / forecasts.length) * 100) / 100,
      rain: sumRain,
    } as WeatherLog;
  }

  /**
   * Retrieve ShortForecast on Weather API
   * @param {number} hours The max hour you want a forecast. Must be a multiple of 3
   * @return {*}  {Promise<ShortForecast[]>} The forecasts list
   * @memberof WeatherService
   */
  public async getForecasts(hours: number): Promise<ShortForecast[]> {
    if (hours % 3 !== 0) {
      throw new Error(`Provided "hours" parameters is not a multiple of 3. Receive <${hours}>.`);
    }

    let $weather: Observable<AxiosResponse<Weather>> = this._http
      .get<Weather>(this._configService.get(CFG_WTHR_API_URL), {
        params: {
          lat: this._configService.get(CFG_WTHR_LAT),
          lon: this._configService.get(CFG_WTHR_LNG),
          appid: this._configService.get(CFG_WTHR_API_TOKEN),
          units: 'metric',
          cnt: hours / 3,
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
    const weather = await firstValueFrom($weather, { defaultValue: undefined });

    return (weather as Weather).list;
  }
}
