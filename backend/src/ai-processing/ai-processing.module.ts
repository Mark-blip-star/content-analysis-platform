import { Module } from '@nestjs/common';
import { AiProcessingService } from './ai-processing.service';

@Module({
  providers: [AiProcessingService],
  exports: [AiProcessingService],
})
export class AiProcessingModule {}
