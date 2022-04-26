import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModuleOptions, MongooseOptionsFactory } from '@nestjs/mongoose';
import { DB_NAME, DB_PASS, DB_PORT, DB_URL, DB_USER } from '../../assets/config.constants';

@Injectable()
export class MongooseConfigService implements MongooseOptionsFactory {
  constructor(private readonly _config: ConfigService) {}

  createMongooseOptions(): MongooseModuleOptions {
    // TODO
    const url: string = this._config.get(DB_URL);
    const port: number = this._config.get(DB_PORT);
    const user: number = this._config.get(DB_USER);
    const pass: number = this._config.get(DB_PASS);
    const dbName: number = this._config.get(DB_NAME);

    return {
      uri: `mongodb://${user}:${pass}@${url}:${port}/${dbName}`,
    };
  }
}
