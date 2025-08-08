import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { QaService } from './qa.service';
import { AskQuestionDto } from './dto/ask-question.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('QA')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('qa')
export class QaController {
  constructor(private readonly qaService: QaService) {}

  @Post()
  @Roles('viewer', 'editor', 'admin')
  @ApiOperation({ summary: 'Ask a question and get an answer based on ingested documents' })
  @ApiResponse({ status: 200, description: 'Answer returned successfully' })
  ask(@Body() dto: AskQuestionDto) {
    return this.qaService.ask(dto);
  }
}
