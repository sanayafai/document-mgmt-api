import { Test, TestingModule } from '@nestjs/testing';
import { IngestionController } from './ingestion.controller';
import { IngestionService } from './ingestion.service';

describe('IngestionController', () => {
  let controller: IngestionController;
  let service: IngestionService;

  const mockIngestedDoc = {
    id: 1,
    title: 'Doc title',
    content: 'Doc content',
    status: 'ingested',
    embeddings: Array(768).fill(0),
    createdAt: new Date(),
  };

  const mockService = {
    ingestOne: jest.fn().mockResolvedValue(mockIngestedDoc),
    ingestAllPending: jest.fn().mockResolvedValue({
      ingested: 2,
      documents: [mockIngestedDoc, { ...mockIngestedDoc, id: 2 }],
    }),
    getStatus: jest.fn().mockResolvedValue({
      total: 5,
      ingested: 3,
      pending: 2,
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IngestionController],
      providers: [
        {
          provide: IngestionService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<IngestionController>(IngestionController);
    service = module.get<IngestionService>(IngestionService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('triggerOne', () => {
    it('should call service.ingestOne and return ingested doc', async () => {
      const result = await controller.triggerOne(1);
      expect(result).toEqual(mockIngestedDoc);
      expect(service.ingestOne).toHaveBeenCalledWith(1);
    });
  });

  describe('triggerBulk', () => {
    it('should call service.ingestAllPending and return summary', async () => {
      const result = await controller.triggerBulk();
      expect(result).toEqual({
        ingested: 2,
        documents: [mockIngestedDoc, { ...mockIngestedDoc, id: 2 }],
      });
      expect(service.ingestAllPending).toHaveBeenCalled();
    });
  });

  describe('getStatus', () => {
    it('should return ingestion status summary', async () => {
      const result = await controller.getStatus();
      expect(result).toEqual({
        total: 5,
        ingested: 3,
        pending: 2,
      });
      expect(service.getStatus).toHaveBeenCalled();
    });
  });
});
