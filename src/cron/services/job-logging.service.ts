import { Injectable, Logger, Scope } from '@nestjs/common';
import { JobLog, StepLog } from '../models/business/job-log';

// Specify service is Singleton (default behavior)
@Injectable({ scope: Scope.DEFAULT })
export class JobLoggingService {
  private readonly _logger = new Logger(JobLoggingService.name);
  private _currentLog: JobLog;

  constructor() {}

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
  public log(log: Partial<StepLog>): void {
    this._currentLog.logs.push({ date: new Date(), severity: 'INFO', author: log.author, message: log.message });
  }

  /**
   * Log an error message into logging context
   * @param {Partial<StepLog>} log You only need to define author & message.
   * @memberof JobLoggingService
   */
  public error(log: Partial<StepLog>): void {
    this._currentLog.logs.push({ date: new Date(), severity: 'ERROR', author: log.author, message: log.message });
  }

  /**
   * Complete logging context by saving it
   * @memberof JobLoggingService
   */
  public completeLog(): void {
    // Code here the transaction with DB
  }
}
