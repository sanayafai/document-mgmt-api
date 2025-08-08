import { Controller, Post, Param, Get, UseGuards, ParseIntPipe } from '@nestjs/common';
import { IngestionService } from './ingestion.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('Ingestion')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('ingestion')
export class IngestionController {
  constructor(private readonly ingestionService: IngestionService) {}

  @Post('trigger/:id')
  @Roles('editor', 'admin')
  @ApiOperation({ summary: 'Trigger ingestion for a single document by ID' })
  @ApiResponse({ status: 200, description: 'Document ingested successfully' })
  triggerOne(@Param('id', ParseIntPipe) id: number) {
    return this.ingestionService.ingestOne(id);
  }

  @Post('bulk')
  @Roles('editor', 'admin')
  @ApiOperation({ summary: 'Trigger ingestion for all pending documents' })
  @ApiResponse({ status: 200, description: 'Bulk ingestion completed' })
  triggerBulk() {
    return this.ingestionService.ingestAllPending();
  }

  @Get('status')
  @Roles('viewer', 'editor', 'admin')
  @ApiOperation({ summary: 'Get ingestion status summary' })
  @ApiResponse({ status: 200, description: 'Ingestion status retrieved' })
  getStatus() {
    return this.ingestionService.getStatus();
  }
}
