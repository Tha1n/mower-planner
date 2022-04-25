export interface JobLog {
  date: Date;
  cronName: string;
  logs: StepLog[];
}

export interface StepLog {
  date: Date;
  author: string;
  message: string;
  severity: 'ERROR' | 'INFO';
}
