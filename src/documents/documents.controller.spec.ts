import { Test, TestingModule } from '@nestjs/testing';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';

describe('DocumentsController', () => {
  let controller: DocumentsController;
  let service: DocumentsService;

  const mockDocument = {
    id: 1,
    title: 'Test Doc',
    content: 'Some content',
    embeddings: [],
  };

  const mockDocumentsService = {
    create: jest.fn().mockResolvedValue(mockDocument),
    findAll: jest.fn().mockResolvedValue([mockDocument]),
    findOne: jest.fn().mockResolvedValue(mockDocument),
    update: jest.fn().mockResolvedValue(mockDocument),
    remove: jest.fn().mockResolvedValue({ affected: 1 }),
    ingest: jest.fn().mockResolvedValue({ ...mockDocument, embeddings: new Array(768).fill(0.1234) }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DocumentsController],
      providers: [
        {
          provide: DocumentsService,
          useValue: mockDocumentsService,
        },
      ],
    }).compile();

    controller = module.get<DocumentsController>(DocumentsController);
    service = module.get<DocumentsService>(DocumentsService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a document', async () => {
    const dto: CreateDocumentDto = {
      title: 'Test Doc',
      content: 'Some content',
    };

    const result = await controller.create(dto);
    expect(result).toEqual(mockDocument);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('should return all documents', async () => {
    const result = await controller.findAll();
    expect(result).toEqual([mockDocument]);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should return one document by ID', async () => {
    const result = await controller.findOne(1);
    expect(result).toEqual(mockDocument);
    expect(service.findOne).toHaveBeenCalledWith(1);
  });

  it('should update a document', async () => {
    const dto: UpdateDocumentDto = { title: 'Updated Title' };
    const result = await controller.update(1, dto);
    expect(result).toEqual(mockDocument);
    expect(service.update).toHaveBeenCalledWith(1, dto);
  });

  it('should delete a document', async () => {
    const result = await controller.remove(1);
    expect(result).toEqual({ affected: 1 });
    expect(service.remove).toHaveBeenCalledWith(1);
  });

  it('should ingest a document and generate embeddings', async () => {
    const result = await controller.ingest(1);
    expect(result.embeddings.length).toBe(768);
    expect(service.ingest).toHaveBeenCalledWith(1);
  });
});
