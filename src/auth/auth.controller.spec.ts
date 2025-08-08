// src/auth/auth.controller.spec.ts

import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should register a user', async () => {
    const dto: RegisterDto = {
      email: 'test@example.com',
      password: 'password123',
      role: 'admin',
    };
    const result = { id: 1, ...dto };
    mockAuthService.register.mockResolvedValue(result);

    expect(await controller.register(dto)).toEqual(result);
    expect(mockAuthService.register).toHaveBeenCalledWith(dto);
  });

  it('should log in a user', async () => {
    const dto: LoginDto = {
      email: 'test@example.com',
      password: 'password123',
    };
    const token = { access_token: 'mock-token' };
    mockAuthService.login.mockResolvedValue(token);

    expect(await controller.login(dto)).toEqual(token);
    expect(mockAuthService.login).toHaveBeenCalledWith(dto);
  });
});
