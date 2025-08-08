import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDocumentDto {
  @ApiProperty({
    description: 'Title of the document',
    example: 'Company Mission Statement',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Full text content of the document',
    example: 'Our mission is to innovate and inspire...',
  })
  @IsString()
  @IsNotEmpty()
  content: string;
}
