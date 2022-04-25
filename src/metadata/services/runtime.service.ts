import { Injectable, Logger } from '@nestjs/common';

/**
 * Service that exposes standard data extract from Node Runtime or Process
 *
 * @export
 * @class RuntimeService
 */
@Injectable()
export class RuntimeService {
  private readonly logger = new Logger(RuntimeService.name);
  private readonly env = process.env;

  constructor() {}

  /**
   * Get app uptime from process
   * @readonly
   * @type {number}
   * @memberof RuntimeService
   */
  public get uptime(): number {
    return process.uptime();
  }

  /**
   * Get APP Version from Package.json
   * @readonly
   * @type {string}
   * @memberof RuntimeService
   */
  public get appVersion(): string {
    return this.env.npm_package_version.toString();
  }
}
