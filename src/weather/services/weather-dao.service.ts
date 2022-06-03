import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { WeatherLog, WeatherLogDocument } from '../models/dao/weather-log.dao';

@Injectable()
export class WeatherDaoService {
  private readonly _logger = new Logger(WeatherDaoService.name);

  constructor(@InjectModel(WeatherLog.name) private weatherModel: Model<WeatherLogDocument>) {}

  public async saveLog(weather: WeatherLog): Promise<
    WeatherLog & {
      _id: Types.ObjectId;
    }
  > {
    // FIXME Find better solution to give access to _id of object ...
    const createdLog = new this.weatherModel(weather);
    return await createdLog.save();
  }

  public getLastHumidityLevels(): number[] {
    throw new Error('Method not implemented.');
  }
}
