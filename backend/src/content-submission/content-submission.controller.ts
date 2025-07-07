import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { ContentSubmissionService } from './content-submission.service';
import { CreateContentDto } from './dto/create-content.dto';

@Controller('content-submission')
@UseGuards(JwtAuthGuard)
export class ContentSubmissionController {
  constructor(
    private readonly contentSubmissionService: ContentSubmissionService,
  ) {}

  @Post()
  async create(
    @Body() dto: CreateContentDto,
    @CurrentUser() user: { userId: number },
  ) {
    return this.contentSubmissionService.handleSubmission(user.userId, dto);
  }

  @Get()
  async findAllForUser(@CurrentUser() user: { userId: number }) {
    return this.contentSubmissionService.findByUser(user.userId);
  }
}
