import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { WEATHER_CRON_LOG_NB_PER_DAY } from '../../assets/cron.constants';
import { WeatherLog, WeatherLogDocument } from '../models/dao/weather-log.dao';

@Injectable()
export class WeatherDaoService {
  private readonly _logger = new Logger(WeatherDaoService.name);

  constructor(@InjectModel(WeatherLog.name) private weatherModel: Model<WeatherLogDocument>) {}

  /**
   * Save a WeatherLog object to Database
   * @param {WeatherLog} weather
   * @return {*}  {(Promise<
   *     WeatherLog & {
   *       _id: Types.ObjectId;
   *     }
   *   >)}
   * @memberof WeatherDaoService
   */
  public async saveLog(weather: WeatherLog): Promise<
    WeatherLog & {
      _id: Types.ObjectId;
    }
  > {
    // FIXME Find better solution to give access to _id of object ...
    this._logger.verbose(`Creating Weather log`);
    const createdLog = new this.weatherModel(weather);
    return await createdLog.save();
  }

  /**
   * Return last logs from requested past days
   * /!\ For 1 day, it may have many and many logs ... Then don't be afraid to receive a big array
   * @param {number} days Number of previous days
   * @return {*}  {WeatherLog[]}
   * @memberof WeatherDaoService
   */
  public async getLastLogs(days: number): Promise<WeatherLog[]> {
    const logsNumber: number = days * WEATHER_CRON_LOG_NB_PER_DAY; // Compute number of logs from number of days requested
    this._logger.verbose(`Retrieving WeatherLog from ${days}. It means ${logsNumber} logs.`);
    return await this.weatherModel.find().sort({ createdAt: -1 }).limit(logsNumber).exec();
  }
}
