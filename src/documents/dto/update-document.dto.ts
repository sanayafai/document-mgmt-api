import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateDocumentDto {
  @ApiPropertyOptional({
    description: 'Updated title of the document',
    example: 'New Company Mission Statement',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    description: 'Updated content of the document',
    example: 'We have expanded our vision to include global innovation...',
  })
  @IsOptional()
  @IsString()
  content?: string;
}
