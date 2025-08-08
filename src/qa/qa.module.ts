import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QaService } from './qa.service';
import { QaController } from './qa.controller';
import { Document } from '../documents/document.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Document])],
  controllers: [QaController],
  providers: [QaService],
})
export class QaModule {}
