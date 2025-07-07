import { IsString, IsIn } from 'class-validator';

export class CreateContentDto {
  @IsIn(['text', 'url'])
  type: 'text' | 'url';

  @IsString()
  rawInput: string;
}
