import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiPropertyOptional({
    description: 'Role to assign to the user',
    example: 'editor',
    enum: ['admin', 'editor', 'viewer'],
  })
  @IsOptional()
  @IsString()
  role?: string; // 'admin' | 'editor' | 'viewer'
}
