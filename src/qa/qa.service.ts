import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Document } from '../documents/document.entity';
import { IsNull, Not, Repository } from 'typeorm';
import { AskQuestionDto } from './dto/ask-question.dto';

@Injectable()
export class QaService {
  constructor(
    @InjectRepository(Document)
    private docRepo: Repository<Document>,
  ) {}

  async ask(dto: AskQuestionDto) {
    const documents = await this.docRepo.find({
      where: { embeddings: Not(IsNull()) },
    });

    if (!documents.length) {
      return { answer: 'No documents have been ingested yet.', source: null };
    }

    // Simulate finding most similar embedding
    const relevantDoc = documents[Math.floor(Math.random() * documents.length)];

    // Simulated answer generation
    const answer = `Based on "${relevantDoc.title}", the answer to "${dto.question}" is: [simulated response].`;

    return {
      answer,
      source: relevantDoc,
    };
  }
}
