import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from './document.entity';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private docRepo: Repository<Document>,
  ) {}

  async create(data: CreateDocumentDto): Promise<Document> {
    const doc = this.docRepo.create(data);
    return this.docRepo.save(doc);
  }

  async findAll(): Promise<Document[]> {
    return this.docRepo.find();
  }

  async findOne(id: number): Promise<Document> {
    const doc = await this.docRepo.findOne({ where: { id } });
    if (!doc) throw new NotFoundException(`Document ${id} not found`);
    return doc;
  }

  async update(id: number, data: UpdateDocumentDto) {
    await this.docRepo.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number) {
    return this.docRepo.delete(id);
  }

  async ingest(id: number) {
    const doc = await this.findOne(id);
    // Simulate 768-dim embeddings
    doc.embeddings = Array(768)
      .fill(0)
      .map(() => Math.random());
    return this.docRepo.save(doc);
  }
}
