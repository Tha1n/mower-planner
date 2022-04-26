export interface JobLogBusiness {
  startedAt: Date;
  endedAt?: Date;
  cronName: string;
  logs: StepLogBusiness[];
}

export interface StepLogBusiness {
  date: Date;
  message: string;
  severity: 'ERROR' | 'INFO';
}
