import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['config/secrets/secrets.env', 'config/config.env'],
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    HttpModule,
  ],
})
export class CommonModule {}
