// src/ingestion/ingestion.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { IngestionService } from './ingestion.service';
import { Document } from '../documents/document.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('IngestionService', () => {
  let service: IngestionService;
  let repo: Repository<Document>;

  const mockDoc: Document = {
    id: 1,
    title: 'Test Doc',
    content: 'Test content',
    embeddings: [],
    createdAt: new Date(),
    status: 'pending',
  };

  const mockRepo = {
    findOneBy: jest.fn(),
    save: jest.fn(),
    findBy: jest.fn(),
    count: jest.fn(),
    countBy: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IngestionService,
        {
          provide: getRepositoryToken(Document),
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<IngestionService>(IngestionService);
    repo = module.get<Repository<Document>>(getRepositoryToken(Document));
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('ingestOne', () => {
    it('should generate embeddings and update document', async () => {
      const doc = { ...mockDoc };
      mockRepo.findOneBy.mockResolvedValue(doc);
      mockRepo.save.mockResolvedValue({ ...doc, status: 'ingested' });

      const result = await service.ingestOne(1);

      expect(mockRepo.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(result.status).toBe('ingested');
      expect(result.embeddings.length).toBe(0);
      expect(mockRepo.save).toHaveBeenCalledWith(expect.objectContaining({
        id: 1,
        status: 'ingested',
      }));
    });

    it('should throw if document not found', async () => {
      mockRepo.findOneBy.mockResolvedValue(null);

      await expect(service.ingestOne(99)).rejects.toThrow('Document 99 not found');
    });
  });

  describe('ingestAllPending', () => {
    it('should ingest all pending documents', async () => {
      const docs = [{ ...mockDoc }, { ...mockDoc, id: 2 }];
      mockRepo.findBy.mockResolvedValue(docs);
      mockRepo.save.mockImplementation((doc) => Promise.resolve({ ...doc }));

      const result = await service.ingestAllPending();

      expect(result.ingested).toBe(2);
      expect(result.documents.length).toBe(2);
      expect(mockRepo.findBy).toHaveBeenCalledWith({ status: 'pending' });
      expect(mockRepo.save).toHaveBeenCalledTimes(2);
    });
  });

  describe('getStatus', () => {
    it('should return ingestion status summary', async () => {
      mockRepo.count.mockResolvedValue(10);
      mockRepo.countBy.mockResolvedValue(6);

      const result = await service.getStatus();

      expect(result).toEqual({
        total: 10,
        ingested: 6,
        pending: 4,
      });
    });
  });
});
