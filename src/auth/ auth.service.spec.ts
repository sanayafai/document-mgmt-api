import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  const mockUser = {
    id: 1,
    email: 'test@example.com',
    password: '', // will be hashed later
    role: 'admin',
  };

  beforeAll(async () => {
    mockUser.password = await bcrypt.hash('password123', 10);
  });

  const mockUsersService = {
    findByEmail: jest.fn().mockResolvedValue(mockUser),
    create: jest.fn().mockImplementation((data) => ({ id: 2, ...data })),
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mocked-jwt-token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login()', () => {
    it('should return an access token for valid credentials', async () => {
      const result = await service.login({ email: mockUser.email, password: 'password123' });
      expect(result).toEqual({ access_token: 'mocked-jwt-token' });
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        email: mockUser.email,
        sub: mockUser.id,
        role: mockUser.role,
      });
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      mockUsersService.findByEmail.mockResolvedValueOnce({ ...mockUser, password: 'wrong' });
      await expect(service.login({ email: mockUser.email, password: 'invalid' })).rejects.toThrow();
    });
  });

  describe('register()', () => {
    it('should hash password and create user', async () => {
      const dto = { email: 'new@example.com', password: 'newpass123', role: 'editor' };
      const result = await service.register(dto);
      expect(mockUsersService.create).toHaveBeenCalledWith(expect.objectContaining({
        email: dto.email,
        role: dto.role,
      }));
      expect(result).toHaveProperty('id');
    });
  });
});
