import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContentSubmission } from 'src/content-submission/entities/content-submission.entity';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Injectable, Logger } from '@nestjs/common';
import { AiProcessingService } from 'src/ai-processing/ai-processing.service';

@Processor('ai-processing')
@Injectable()
export class AiQueueProcessor {
  private readonly logger = new Logger(AiQueueProcessor.name);

  constructor(
    private readonly aiService: AiProcessingService,
    @InjectRepository(ContentSubmission)
    private readonly contentRepo: Repository<ContentSubmission>,
  ) {}

  @Process('process-content')
  async handle(job: Job<{ contentId: number; text: string }>) {
    this.logger.log('Job started');

    const { contentId, text } = job.data;
    const summary = await this.aiService.generateSummary(text);
    this.logger.log(`Summary generated: ${summary}`);

    const keywords = await this.aiService.extractKeywords(text);
    this.logger.log(`Keywords extracted: ${JSON.stringify(keywords)}`);

    const content = await this.contentRepo.findOne({
      where: { id: contentId },
    });

    if (!content) {
      this.logger.warn(`Content with ID ${contentId} not found`);
      return;
    }

    content.status = 'completed';
    content.extractedText = text;
    (content as any).summary = summary;
    (content as any).keywords = keywords;

    await this.contentRepo.save(content);
    this.logger.log('Content saved successfully');
  }
}
