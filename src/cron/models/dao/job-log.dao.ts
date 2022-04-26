import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export class StepLog {
  date: Date;
  message: string;
  severity: 'ERROR' | 'INFO';
}

export type JobLogDocument = JobLog & Document;

@Schema()
export class JobLog {
  @Prop()
  startedAt: Date;
  @Prop()
  endedAt: Date;
  @Prop()
  cronName: string;
  @Prop([StepLog])
  logs: StepLog[];
}

export const JobLogSchema = SchemaFactory.createForClass(JobLog);
