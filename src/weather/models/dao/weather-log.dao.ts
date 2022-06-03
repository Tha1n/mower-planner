import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type WeatherLogDocument = WeatherLog & Document;

@Schema()
export class WeatherLog {
  @Prop()
  date: Date;
  @Prop()
  avgHumidity: number;
  @Prop()
  rain: number;
}

export const WeatherLogSchema = SchemaFactory.createForClass(WeatherLog);
