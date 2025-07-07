import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class AiProcessingService {
  private readonly openai: OpenAI;
  private readonly logger = new Logger(AiProcessingService.name);

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async generateSummary(text: string): Promise<string> {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an assistant that summarizes Ukrainian text.',
          },
          {
            role: 'user',
            content: `Summarize the following text to its essential content:\n\n${text}`,
          },
        ],
      });

      return response.choices[0].message.content?.trim() || '';
    } catch (error) {
      this.logger.error(
        'Summary generation failed',
        error.stack || error.message,
      );
      throw new InternalServerErrorException('Failed to generate summary');
    }
  }

  async extractKeywords(text: string): Promise<string[]> {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an assistant that extracts key terms from text.',
          },
          {
            role: 'user',
            content: `Extract 5–10 key words or phrases from this text. Respond ONLY with a JSON array of strings, no explanation:\n\n${text}`,
          },
        ],
      });

      const raw = response.choices[0].message.content?.trim() || '';
      const cleaned = raw
        .replace(/^\s*```json\s*/i, '')
        .replace(/\s*```$/, '')
        .trim();

      let parsed;
      try {
        parsed = JSON.parse(cleaned);
      } catch (parseError) {
        this.logger.error('Failed to parse JSON from OpenAI response', {
          raw,
          cleaned,
          parseError: parseError.message,
        });
        throw new InternalServerErrorException(
          'Failed to parse keyword response from AI',
        );
      }

      if (!Array.isArray(parsed)) {
        this.logger.error('Parsed result is not an array', { parsed });
        throw new InternalServerErrorException(
          'Invalid keyword format received from AI',
        );
      }

      return parsed;
    } catch (error) {
      this.logger.error(
        'Keyword extraction failed',
        error.stack || error.message,
      );
      throw new InternalServerErrorException('Failed to extract keywords');
    }
  }
}
