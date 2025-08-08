import { Test, TestingModule } from '@nestjs/testing';
import { QaController } from './qa.controller';
import { QaService } from './qa.service';
import { AskQuestionDto } from './dto/ask-question.dto';

describe('QaController', () => {
  let controller: QaController;
  let service: QaService;

  const mockResponse = {
    question: 'What is the company mission?',
    answer: 'Our mission is to innovate continuously.',
  };

  const mockQaService = {
    ask: jest.fn().mockResolvedValue(mockResponse),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QaController],
      providers: [
        {
          provide: QaService,
          useValue: mockQaService,
        },
      ],
    }).compile();

    controller = module.get<QaController>(QaController);
    service = module.get<QaService>(QaService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('ask()', () => {
    it('should return an answer to the question', async () => {
      const dto: AskQuestionDto = { question: 'What is the company mission?' };
      const result = await controller.ask(dto);
      expect(result).toEqual(mockResponse);
      expect(service.ask).toHaveBeenCalledWith(dto);
    });

    it('should call service.ask exactly once with correct question', async () => {
      const dto: AskQuestionDto = { question: 'What are our core values?' };
      await controller.ask(dto);
      expect(service.ask).toHaveBeenCalledTimes(1);
      expect(service.ask).toHaveBeenCalledWith(dto);
    });
  });
});
