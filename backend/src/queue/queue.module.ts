import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { AiQueueProcessor } from './processors/queue.processor';
import { AiProcessingModule } from 'src/ai-processing/ai-processing.module';
import { ContentSubmission } from 'src/content-submission/entities/content-submission.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NottificationsModule } from 'src/notifications/nottifications.module';

@Module({
  imports: [
    NottificationsModule,
    TypeOrmModule.forFeature([ContentSubmission]),
    BullModule.registerQueue({
      name: 'ai-processing',
    }),
    AiProcessingModule,
  ],
  providers: [AiQueueProcessor],
  exports: [],
})
export class QueueModule {}
