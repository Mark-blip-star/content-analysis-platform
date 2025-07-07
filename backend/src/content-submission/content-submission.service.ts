import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ContentSubmission } from './entities/content-submission.entity';
import { Repository } from 'typeorm';
import { CreateContentDto } from './dto/create-content.dto';
import { extractMainContentFromUrl } from 'src/utils/content-parser.util';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class ContentSubmissionService {
  constructor(
    @InjectRepository(ContentSubmission)
    private readonly contentRepo: Repository<ContentSubmission>,
    @InjectQueue('ai-processing')
    private readonly aiQueue: Queue,
  ) {}

  async handleSubmission(userId: number, dto: CreateContentDto) {
    if (!dto.type || !dto.rawInput) {
      throw new BadRequestException('Invalid content submission payload');
    }

    let parsedInput = dto.rawInput;

    if (dto.type === 'url') {
      try {
        parsedInput = await extractMainContentFromUrl(dto.rawInput);
        if (!parsedInput || parsedInput.length < 100) {
          throw new BadRequestException(
            'Unable to extract sufficient content from URL',
          );
        }
      } catch (err) {
        throw new BadRequestException('Failed to extract content from URL');
      }
    }

    const content = this.contentRepo.create({
      user: { id: userId },
      type: dto.type,
      rawInput: parsedInput,
      status: 'pending',
    });

    const savedContent = await this.contentRepo.save(content);

    await this.aiQueue.add('process-content', {
      contentId: savedContent.id,
      text: parsedInput,
    });

    return savedContent;
  }

  async findByUser(userId: number) {
    return this.contentRepo.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }
}
