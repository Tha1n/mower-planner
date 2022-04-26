import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export class StepLog {
  date: Date;
  author: string;
  message: string;
  severity: 'ERROR' | 'INFO';
}

export type JobLogDocument = JobLog & Document;

@Schema()
export class JobLog {
  @Prop()
  date: Date;
  @Prop()
  cronName: string;
  @Prop([StepLog])
  logs: StepLog[];
}

export const JobLogSchema = SchemaFactory.createForClass(JobLog);
