import { Module } from '@nestjs/common';
import { CommonModule } from 'src/common/common.module';
import { MetadataController } from './controllers/metadata.controller';

@Module({
  imports: [CommonModule],
  controllers: [MetadataController],
})
export class MetadataModule {}
