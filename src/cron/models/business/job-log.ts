export interface JobLogBusiness {
  date: Date;
  cronName: string;
  logs: StepLogBusiness[];
}

export interface StepLogBusiness {
  date: Date;
  author: string;
  message: string;
  severity: 'ERROR' | 'INFO';
}
