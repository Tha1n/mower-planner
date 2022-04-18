import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { MowerAuthService } from './services/mower-auth.service';
import { MowerService } from './services/mower.service';

@Module({
  imports: [CommonModule, HttpModule],
  providers: [MowerAuthService, MowerService],
  exports: [MowerService],
})
export class MowerModule {}
