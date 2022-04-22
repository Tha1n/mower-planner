import { Controller, Get, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CFG_APP_DESCRIPTION, CFG_APP_NAME, CFG_APP_VERSION } from '../../assets/config.constants';
import { Metadata } from '../models/metadata';

@Controller('metadata')
export class MetadataController {
  private readonly _logger = new Logger(MetadataController.name);

  constructor(private readonly _configService: ConfigService) {}

  @Get()
  getInfo(): Metadata {
    this._logger.log('Getting app metadata.');
    return {
      appName: this._configService.get<string>(CFG_APP_NAME),
      description: this._configService.get<string>(CFG_APP_DESCRIPTION),
      version: this._configService.get<string>(CFG_APP_VERSION),
      uptime: this.uptimeToDuration(process.uptime()),
    };
  }

  /**
   * Convert a number (typically the server uptime) to a human readable duration
   * @private
   * @param {number} uptime
   * @returns {string}
   * @memberof MetadataController
   */
  private uptimeToDuration(uptime: number): string {
    const years = Math.floor(uptime / 31536000);
    const days = Math.floor((uptime % 31536000) / 86400);
    const hours = Math.floor(((uptime % 31536000) % 86400) / 3600);
    const minutes = Math.floor((((uptime % 31536000) % 86400) % 3600) / 60);
    const seconds = (((uptime % 31536000) % 86400) % 3600) % 60;
    return `${years} Years, ${days} Days, ${this.pad(hours)}h${this.pad(minutes)}:${this.pad(seconds)}`;
  }

  /**
   * Adding leading 0 on a number when display it to string
   * @private
   * @param {number} num
   * @param {number} [size=2]
   * @returns {string}
   * @memberof MetadataController
   */
  private pad(num: number, size = 2): string {
    let numS = num.toFixed(0);
    while (numS.length < size) {
      numS = '0' + numS;
    }
    return numS;
  }
}
