import { Injectable, Logger } from '@nestjs/common';

/**
 * Service that exposes standard data extract from Node Runtime or Process
 *
 * @export
 * @class RuntimeService
 */
@Injectable()
export class RuntimeService {
  private readonly _logger = new Logger(RuntimeService.name);
  private readonly _process = process;

  constructor() {}

  /**
   * Get app uptime from process
   * @readonly
   * @type {number}
   * @memberof RuntimeService
   */
  public get uptime(): number {
    return this._process.uptime();
  }

  /**
   * Get APP Version from Package.json
   * @readonly
   * @type {string}
   * @memberof RuntimeService
   */
  public get appVersion(): string {
    console.log(this._process.env);
    return this._process.env.npm_package_version?.toString() ?? '0.0.0';
  }
}
