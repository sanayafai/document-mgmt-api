import { Test, TestingModule } from '@nestjs/testing';
import { QaService } from './qa.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Document } from '../documents/document.entity';
import { Repository } from 'typeorm';
import { AskQuestionDto } from './dto/ask-question.dto';

describe('QaService', () => {
  let service: QaService;
  let repo: jest.Mocked<Repository<Document>>;

  const mockDocuments: Document[] = [
    {
      id: 1,
      title: 'Company Vision',
      content: 'Our vision is to revolutionize AI.',
      embeddings: Array(768).fill(0).map(() => Math.random()),
      createdAt: new Date(),
      status: 'ingested',
    },
  ];

  const mockRepo = {
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QaService,
        {
          provide: getRepositoryToken(Document),
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<QaService>(QaService);
    repo = module.get(getRepositoryToken(Document));
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a simulated answer when documents exist', async () => {
    const dto: AskQuestionDto = { question: 'What is the company mission?' };
    mockRepo.find.mockResolvedValueOnce(mockDocuments);

    const result = await service.ask(dto);

    expect(mockRepo.find).toHaveBeenCalledWith({
      where: { embeddings: expect.any(Object) },
    });

    expect(result.answer).toContain('Based on "Company Vision"');
    expect(result.source).toEqual(mockDocuments[0]);
  });

  it('should return fallback message when no documents are ingested', async () => {
    const dto: AskQuestionDto = { question: 'What is the company mission?' };
    mockRepo.find.mockResolvedValueOnce([]);

    const result = await service.ask(dto);

    expect(result).toEqual({
      answer: 'No documents have been ingested yet.',
      source: null,
    });
  });
});
