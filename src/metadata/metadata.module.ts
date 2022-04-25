import { Module } from '@nestjs/common';
import { CommonModule } from '../common/common.module';
import { MetadataController } from './controllers/metadata.controller';
import { RuntimeService } from './services/runtime.service';

@Module({
  imports: [CommonModule],
  controllers: [MetadataController],
  providers: [RuntimeService],
  exports: [RuntimeService],
})
export class MetadataModule {}
