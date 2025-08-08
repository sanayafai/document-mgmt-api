import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { Document } from './document.entity';

describe('DocumentsService', () => {
  let service: DocumentsService;
  let repo: jest.Mocked<Repository<Document>>;

  const mockDocument: Document = {
    id: 1,
    title: 'Test Document',
    content: 'Sample content',
    embeddings: [],
  };

  const mockRepo = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentsService,
        {
          provide: getRepositoryToken(Document),
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<DocumentsService>(DocumentsService);
    repo = module.get(getRepositoryToken(Document));
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a document', async () => {
    const data = { title: 'Test Document', content: 'Sample content' };
    mockRepo.create.mockReturnValue(mockDocument);
    mockRepo.save.mockResolvedValue(mockDocument);

    const result = await service.create(data);
    expect(result).toEqual(mockDocument);
    expect(mockRepo.create).toHaveBeenCalledWith(data);
    expect(mockRepo.save).toHaveBeenCalledWith(mockDocument);
  });

  it('should return all documents', async () => {
    mockRepo.find.mockResolvedValue([mockDocument]);

    const result = await service.findAll();
    expect(result).toEqual([mockDocument]);
  });

  it('should return one document by ID', async () => {
    mockRepo.findOne.mockResolvedValue(mockDocument);

    const result = await service.findOne(1);
    expect(result).toEqual(mockDocument);
    expect(mockRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it('should throw NotFoundException if document not found', async () => {
    mockRepo.findOne.mockResolvedValue(null);

    await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
  });

  it('should update a document and return the updated one', async () => {
    const updatedDoc = { ...mockDocument, title: 'Updated Title' };
    mockRepo.update.mockResolvedValue({ affected: 1 } as any);
    mockRepo.findOne.mockResolvedValue(updatedDoc);

    const result = await service.update(1, { title: 'Updated Title' });
    expect(result).toEqual(updatedDoc);
    expect(mockRepo.update).toHaveBeenCalledWith(1, { title: 'Updated Title' });
  });

  it('should delete a document', async () => {
    mockRepo.delete.mockResolvedValue({ affected: 1 } as any);

    const result = await service.remove(1);
    expect(result).toEqual({ affected: 1 });
    expect(mockRepo.delete).toHaveBeenCalledWith(1);
  });

  it('should ingest a document and assign 768-dim embeddings', async () => {
    mockRepo.findOne.mockResolvedValue(mockDocument);
    mockRepo.save.mockResolvedValue({
      ...mockDocument,
      embeddings: new Array(768).fill(0.1234),
    });

    const result = await service.ingest(1);
    expect(result.embeddings).toHaveLength(768);
    expect(mockRepo.save).toHaveBeenCalled();
  });
});
