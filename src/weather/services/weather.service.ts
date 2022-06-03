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
} from '../../assets/config.constants';
import { Weather } from '../models/business/weather.business';
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

  public async isWeatherRainy(): Promise<boolean> {
    const humidityLevelReference: number = Number(this._configService.get(CFG_WTHR_HUM_LVL));
    const maxRainReference: number = Number(this._configService.get(CFG_WTHR_RAIN_LVL));

    // Retrieve weather data through external API
    let weatherData: Weather = await this.getWeatherData();

    // Simple loop to sum up rainfall and humidity (to compute avg humidity further)
    // Better than using map/reduce
    let sumHumid: number = 0;
    let sumRain: number = 0;
    for (const forecast of weatherData.list) {
      sumRain += forecast?.rain?.['3h'] ?? 0;
      sumHumid += forecast.main.humidity;
    }

    // Save data to DB
    const savedLog = await this.dao.saveLog({
      date: new Date(),
      avgHumidity: Math.round((sumHumid / weatherData.list.length) * 100) / 100,
      rain: sumRain,
    } as WeatherLog);
    this._logger.log(`New weather log added with id <${savedLog._id}>`);

    // Check rainfall
    this._logger.log(`Curr Rain - ${sumRain} | Ref Rain - ${maxRainReference}`);
    if (sumRain >= maxRainReference) {
      return true;
    }

    // If rainfall is OK, check humidity average levels
    const humidityLevels: number[] = this.dao.getLastHumidityLevels();
    const avgHumidityLevel: number = humidityLevels.reduce((prev, curr) => prev + curr, 0) / humidityLevels.length;
    this._logger.log(`Avg Humidity - ${avgHumidityLevel} | Ref Avg Humidity - ${humidityLevelReference}`);
    if (avgHumidityLevel >= humidityLevelReference) {
      return true;
    }

    return false;
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
