import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['config/local/config.local.env', 'config/config.env'],
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    JwtModule.register({}), // No config since we do not encode token on this app
    HttpModule,
  ],
  exports: [JwtModule],
})
export class CommonModule {}
