import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

const mockAuthService = () => ({
  signUp: jest.fn(),
  signIn: jest.fn(),
});
const credentials = { username: 'Test user', password: 'Test password1' };

describe('AuthController', () => {
  let controller: AuthController;
  let authService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useFactory: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('signUp passes the credentials to AuthService', async () => {
    authService.signUp.mockResolvedValue(undefined);
    await controller.signUp(credentials);
    expect(authService.signUp).toHaveBeenCalledWith(credentials);
  });

  it('signIn returns the access token from AuthService', async () => {
    authService.signIn.mockResolvedValue({ accessToken: 'signed-token' });
    expect(await controller.signIn(credentials)).toEqual({
      accessToken: 'signed-token',
    });
    expect(authService.signIn).toHaveBeenCalledWith(credentials);
  });

  it('signIn lets UnauthorizedException through', async () => {
    authService.signIn.mockRejectedValue(new UnauthorizedException());
    await expect(controller.signIn(credentials)).rejects.toThrow(
      UnauthorizedException
    );
  });
});
