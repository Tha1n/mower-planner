import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type WeatherLogDocument = WeatherLog & Document;

@Schema({
  timestamps: true,
})
export class WeatherLog {
  @Prop()
  avgHumidity: number;
  @Prop()
  rain: number;
}

export const WeatherLogSchema = SchemaFactory.createForClass(WeatherLog);

// Create manually an index on Mongoose
// Set explicitely that this index will expire (ensure cleaning log document that became useless)
WeatherLogSchema.index({ createdAt: 1 }, { expires: '7d' });
