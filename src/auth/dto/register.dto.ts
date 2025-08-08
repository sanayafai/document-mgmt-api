import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    description: 'Email address for the new user',
    example: 'newuser@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Password for the new user (min 6 characters)',
    example: 'strongPass123',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    description: 'Role assigned to the new user',
    example: 'editor',
    enum: ['admin', 'editor', 'viewer'],
  })
  @IsString()
  role: string; // admin | editor | viewer
}
