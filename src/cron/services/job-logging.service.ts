import { Injectable, Logger, Scope } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JobLogBusiness, StepLogBusiness } from '../models/business/job-log';
import { JobLog, JobLogDocument } from '../models/dao/job-log.dao';

// Specify service is Singleton (default behavior)
@Injectable({ scope: Scope.DEFAULT })
export class JobLoggingService {
  private readonly _logger = new Logger(JobLoggingService.name);
  private _currentLog: JobLogBusiness;

  constructor(@InjectModel(JobLog.name) private jobLogModel: Model<JobLogDocument>) {}

  /**
   * Initialize a logging context for cron job
   * @param {string} cronName
   * @memberof JobLoggingService
   */
  public initLog(cronName: string): void {
    // Re-init joblog
    this._currentLog = { date: new Date(), cronName: cronName, logs: [] };
  }

  /**
   * Log a message into logging context
   * @param {Partial<StepLog>} log You only need to define author & message.
   * @memberof JobLoggingService
   */
  public info(log: Partial<StepLogBusiness>): void {
    if (this.isCurrentLogExisting()) {
      this._currentLog.logs.push({ date: new Date(), severity: 'INFO', author: log.author, message: log.message });
    } else {
      this._logger.warn('Cannot push an info log if you have not create a JobLog first.');
    }
  }

  /**
   * Log an error message into logging context
   * @param {Partial<StepLog>} log You only need to define author & message.
   * @memberof JobLoggingService
   */
  public error(log: Partial<StepLogBusiness>): void {
    if (this.isCurrentLogExisting()) {
      this._currentLog.logs.push({ date: new Date(), severity: 'ERROR', author: log.author, message: log.message });
    } else {
      this._logger.warn('Cannot push an error log if you have not create a JobLog first.');
    }
  }

  /**
   * Complete logging context by saving it
   * @memberof JobLoggingService
   */
  public completeLog(): void {
    if (this.isCurrentLogExisting()) {
      // Save it to DB
      const createdLog = new this.jobLogModel(this._currentLog);
      createdLog.save();
    } else {
      this._logger.warn('Cannot save a JobLog if you have not create one first.');
    }
  }

  private isCurrentLogExisting(): boolean {
    return !!this._currentLog && !!this._currentLog.cronName;
  }
}
