import { Module } from '@nestjs/common';
import { ContentSubmissionController } from './content-submission.controller';
import { ContentSubmissionService } from './content-submission.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContentSubmission } from './entities/content-submission.entity';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    TypeOrmModule.forFeature([ContentSubmission]),
    BullModule.registerQueue({
      name: 'ai-processing',
    }),
  ],
  controllers: [ContentSubmissionController],
  providers: [ContentSubmissionService],
})
export class ContentSubmissionModule {}
