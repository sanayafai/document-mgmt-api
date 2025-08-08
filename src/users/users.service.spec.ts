import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';

describe('UsersService', () => {
  let service: UsersService;
  let repo: jest.Mocked<Repository<User>>;

  const mockUser: User = {
    id: 1,
    email: 'test@example.com',
    password: 'hashed-password',
    role: 'admin',
  };

  const mockUserArray: User[] = [mockUser];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repo = module.get(getRepositoryToken(User));
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a user', async () => {
    repo.create.mockReturnValue(mockUser);
    repo.save.mockResolvedValue(mockUser);

    const result = await service.create(mockUser);
    expect(repo.create).toHaveBeenCalledWith(mockUser);
    expect(repo.save).toHaveBeenCalledWith(mockUser);
    expect(result).toEqual(mockUser);
  });

  it('should return all users', async () => {
    repo.find.mockResolvedValue(mockUserArray);

    const result = await service.findAll();
    expect(result).toEqual(mockUserArray);
  });

  it('should return one user by ID', async () => {
    repo.findOne.mockResolvedValue(mockUser);

    const result = await service.findOne(1);
    expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(result).toEqual(mockUser);
  });

  it('should throw NotFoundException if user not found by ID', async () => {
    repo.findOne.mockResolvedValue(null);

    await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
  });

  it('should return one user by email', async () => {
    repo.findOne.mockResolvedValue(mockUser);

    const result = await service.findByEmail(mockUser.email);
    expect(repo.findOne).toHaveBeenCalledWith({ where: { email: mockUser.email } });
    expect(result).toEqual(mockUser);
  });

  it('should throw NotFoundException if user not found by email', async () => {
    repo.findOne.mockResolvedValue(null);

    await expect(service.findByEmail('nope@example.com')).rejects.toThrow(NotFoundException);
  });

  it('should update a user and return updated user', async () => {
    repo.update.mockResolvedValue({ affected: 1 } as any);
    repo.findOne.mockResolvedValue(mockUser);

    const result = await service.update(1, { role: 'editor' });
    expect(repo.update).toHaveBeenCalledWith(1, { role: 'editor' });
    expect(result).toEqual(mockUser);
  });

  it('should delete a user', async () => {
    repo.delete.mockResolvedValue({ affected: 1 } as any);

    const result = await service.remove(1);
    expect(repo.delete).toHaveBeenCalledWith(1);
    expect(result).toEqual({ affected: 1 });
  });
});
