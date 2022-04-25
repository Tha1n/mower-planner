export class CronData {
  /**
   * Data for this job name
   * @type {JobData}
   * @memberof CronData
   */
  [name: string]: JobData;
}

export class JobData {
  /**
   * Date of last run for this job
   * @type {Date | string}
   * @memberof JobData
   */
  lastRun: Date | string;
  /**
   * Date of the next run for this job
   * @type {moment.Moment}
   * @memberof JobData
   */
  nextRun: moment.Moment;
  /**
   * Indicate whether or not the job is running
   * @type {boolean}
   * @memberof JobData
   */
  isRunning: boolean;
}
