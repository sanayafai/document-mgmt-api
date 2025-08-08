import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AskQuestionDto {
  @ApiProperty({
    description: 'The question you want to ask based on the ingested documents',
    example: 'What is the company mission?',
  })
  @IsString()
  @IsNotEmpty()
  question: string;
}
