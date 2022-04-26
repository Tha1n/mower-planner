import { Injectable, Logger, Scope } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JobLogBusiness } from '../models/business/job-log';
import { JobLog, JobLogDocument } from '../models/dao/job-log.dao';

// Specify service is create for EACH CONSUMER that call it
@Injectable({ scope: Scope.TRANSIENT })
export class CronLoggingService {
  private readonly _logger = new Logger(CronLoggingService.name);
  private _cronLogs: JobLogBusiness;

  constructor(@InjectModel(JobLog.name) private jobLogModel: Model<JobLogDocument>) {}

  /**
   * Initialize a logging context for cron job
   * @param {string} cronName
   * @memberof JobLoggingService
   */
  public initLoggingContext(cronName: string): void {
    // Init cronLog
    this._cronLogs = { startedAt: new Date(), cronName: cronName, logs: [] };
  }

  /**
   * Log an info message into logging context
   * @param {Partial<StepLog>} log You only need to define author & message.
   * @memberof JobLoggingService
   */
  public info(message: string): void {
    if (this.isCronLogInitialized()) {
      this._cronLogs.logs.push({ date: new Date(), severity: 'INFO', message: message });
    } else {
      this._logger.warn('Unable to push an info log since no CronLog has been initialized.');
    }
  }

  /**
   * Log an error message into logging context
   * @param {Partial<StepLog>} log You only need to define author & message.
   * @memberof JobLoggingService
   */
  public error(message: string): void {
    if (this.isCronLogInitialized()) {
      this._cronLogs.logs.push({ date: new Date(), severity: 'ERROR', message: message });
    } else {
      this._logger.warn('Unable to push an error log since no CronLog has been initialized.');
    }
  }

  /**
   * Complete logging context by saving it
   * @memberof JobLoggingService
   */
  public completeLoggingContext(cronName: string): void {
    if (!this.isCronLogInitialized()) {
      this._logger.error(
        'No context initialize, you probably miss something. Creating en empty and save it for further investigation.',
      );
      this.initLoggingContext(cronName);
    }
    // Save it to DB
    this._cronLogs.endedAt = new Date();
    new this.jobLogModel(this._cronLogs).save();

    // Clear data to avoid bad patterns works
    this.initLoggingContext('');
  }

  private isCronLogInitialized(): boolean {
    return !!this._cronLogs?.cronName;
  }
}
