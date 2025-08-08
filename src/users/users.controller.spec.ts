import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './user.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUser: User = {
    id: 1,
    email: 'test@example.com',
    password: 'hashed-password',
    role: 'admin',
  };

  const mockService = {
    create: jest.fn().mockResolvedValue(mockUser),
    findAll: jest.fn().mockResolvedValue([mockUser]),
    findOne: jest.fn().mockResolvedValue(mockUser),
    update: jest.fn().mockResolvedValue(mockUser),
    remove: jest.fn().mockResolvedValue({ affected: 1 }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a user', async () => {
    const dto = {
      email: 'test@example.com',
      password: 'secret123',
      role: 'admin',
    };
    const result = await controller.create(dto);
    expect(result).toEqual(mockUser);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('should return all users', async () => {
    const result = await controller.findAll();
    expect(result).toEqual([mockUser]);
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should return one user by ID', async () => {
    const result = await controller.findOne(1);
    expect(result).toEqual(mockUser);
    expect(service.findOne).toHaveBeenCalledWith(1); // string ID converted to number
  });

  it('should update a user', async () => {
    const dto = { role: 'editor' };
    const result = await controller.update(1, dto);
    expect(result).toEqual(mockUser);
    expect(service.update).toHaveBeenCalledWith(1, dto);
  });

  it('should delete a user', async () => {
    const result = await controller.remove(1);
    expect(result).toEqual({ affected: 1 });
    expect(service.remove).toHaveBeenCalledWith(1);
  });
});
