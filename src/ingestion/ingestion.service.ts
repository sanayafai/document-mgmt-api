import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from '../documents/document.entity';

@Injectable()
export class IngestionService {
  constructor(
    @InjectRepository(Document)
    private docRepo: Repository<Document>,
  ) {}

  async ingestOne(id: number) {
    const doc = await this.docRepo.findOneBy({ id });
    if (!doc) throw new Error(`Document ${id} not found`);

    // Simulate embedding generation
    doc.embeddings = Array(768).fill(0).map(() => Math.random());
    doc.status = 'ingested';

    return this.docRepo.save(doc);
  }

  async ingestAllPending() {
    const docs = await this.docRepo.findBy({ status: 'pending' });

    const results = await Promise.all(
      docs.map((doc) => {
        doc.embeddings = Array(768).fill(0).map(() => Math.random());
        doc.status = 'ingested';
        return this.docRepo.save(doc);
      }),
    );

    return {
      ingested: results.length,
      documents: results,
    };
  }

  async getStatus() {
    const total = await this.docRepo.count();
    const ingested = await this.docRepo.countBy({ status: 'ingested' });

    return {
      total,
      ingested,
      pending: total - ingested,
    };
  }
}
