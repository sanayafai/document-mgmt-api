import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('Documents')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post()
  @Roles('editor', 'admin')
  @ApiOperation({ summary: 'Upload a new document' })
  @ApiResponse({ status: 201, description: 'Document uploaded' })
  create(@Body() dto: CreateDocumentDto) {
    return this.documentsService.create(dto);
  }

  @Get()
  @Roles('viewer', 'editor', 'admin')
  @ApiOperation({ summary: 'Get all documents' })
  @ApiResponse({ status: 200, description: 'List of documents' })
  findAll() {
    return this.documentsService.findAll();
  }

  @Get(':id')
  @Roles('viewer', 'editor', 'admin')
  @ApiOperation({ summary: 'Get a document by ID' })
  @ApiResponse({ status: 200, description: 'Single document' })
  @ApiResponse({ status: 404, description: 'Document not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.documentsService.findOne(id);
  }

  @Patch(':id')
  @Roles('editor', 'admin')
  @ApiOperation({ summary: 'Update a document' })
  @ApiResponse({ status: 200, description: 'Document updated' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateDocumentDto) {
    return this.documentsService.update(id, dto);
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: 'Delete a document' })
  @ApiResponse({ status: 200, description: 'Document deleted' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.documentsService.remove(id);
  }

  @Post(':id/ingest')
  @Roles('editor', 'admin')
  @ApiOperation({ summary: 'Ingest a document (simulate embeddings)' })
  @ApiResponse({ status: 200, description: 'Document ingested' })
  ingest(@Param('id', ParseIntPipe) id: number) {
    return this.documentsService.ingest(id);
  }
}
