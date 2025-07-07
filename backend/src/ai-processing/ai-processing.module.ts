import { Module } from '@nestjs/common';
import { AiProcessingController } from './ai-processing.controller';
import { AiProcessingService } from './ai-processing.service';

@Module({
  controllers: [AiProcessingController],
  providers: [AiProcessingService],
  exports: [AiProcessingService],
})
export class AiProcessingModule {}
