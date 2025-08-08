import { Module } from '@nestjs/common';
import { IngestionService } from './ingestion.service';
import { IngestionController } from './ingestion.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Document } from '../documents/document.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Document])],
  controllers: [IngestionController],
  providers: [IngestionService],
})
export class IngestionModule {}
