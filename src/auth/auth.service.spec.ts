import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { UsersRepository } from './users.repository';

const mockUsersRepository = () => ({
  createUser: jest.fn(),
  findOne: jest.fn(),
});
const mockJwtService = () => ({
  sign: jest.fn(),
});
const credentials = { username: 'Test user', password: 'Test password1' };

describe('AuthService', () => {
  let service: AuthService;
  let usersRepository;
  let jwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersRepository, useFactory: mockUsersRepository },
        { provide: JwtService, useFactory: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersRepository = module.get(UsersRepository);
    jwtService = module.get(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signUp', () => {
    it('creates the user through the repository', async () => {
      usersRepository.createUser.mockResolvedValue(undefined);
      await service.signUp(credentials);
      expect(usersRepository.createUser).toHaveBeenCalledWith(credentials);
    });
  });

  describe('signIn', () => {
    it('returns a signed access token for valid credentials', async () => {
      const password = await bcrypt.hash(credentials.password, 4);
      usersRepository.findOne.mockResolvedValue({
        username: credentials.username,
        password,
      });
      jwtService.sign.mockReturnValue('signed-token');

      expect(await service.signIn(credentials)).toEqual({
        accessToken: 'signed-token',
      });
      expect(jwtService.sign).toHaveBeenCalledWith({
        username: credentials.username,
      });
    });

    it('throws UnauthorizedException for a wrong password', async () => {
      const password = await bcrypt.hash('another password', 4);
      usersRepository.findOne.mockResolvedValue({
        username: credentials.username,
        password,
      });

      await expect(service.signIn(credentials)).rejects.toThrow(
        UnauthorizedException
      );
      expect(jwtService.sign).not.toHaveBeenCalled();
    });

    it('throws UnauthorizedException for an unknown user', async () => {
      usersRepository.findOne.mockResolvedValue(undefined);
      await expect(service.signIn(credentials)).rejects.toThrow(
        UnauthorizedException
      );
    });
  });
});
