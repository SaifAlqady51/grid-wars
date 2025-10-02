import {
  describe,
  beforeEach,
  afterEach,
  it,
  expect,
  jest,
} from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountService } from './account.service';
import {
  BadRequestException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AccountValidatorService, PasswordService } from './validation/';
import { RegisterDto, LoginDto, UpdateUsernameDto } from './dto';
import { JwtAuthService } from '@grid-wars/jwt';
import { Account } from './entity/account.entity';
import { AwsS3Service } from '@grid-wars/aws-s3';

describe('AccountService', () => {
  let service: AccountService;
  let accountRepository: Repository<Account>;
  let accountValidatorService: AccountValidatorService;
  let passwordService: PasswordService;
  let jwtAuthService: JwtAuthService;

  const mockAccount: Partial<Account> = {
    id: '1',
    email: 'test@example.com',
    username: 'testuser',
    password: 'hashedPassword123',
    createdAt: new Date(),
    updatedAt: new Date(),
    isActive: true,
    wins: 10,
    losses: 5,
    draws: 2,
    streakDays: 3,
    level: 5,
    profileImage: 'profile.jpg',
    totalGames: 17,
  };

  const mockAccountWithoutPassword = {
    id: '1',
    email: 'test@example.com',
    username: 'testuser',
    createdAt: new Date(),
    updatedAt: new Date(),
    isActive: true,
    wins: 10,
    losses: 5,
    draws: 2,
    streakDays: 3,
    level: 5,
    profileImage: 'profile.jpg',
    totalGames: 17,
  };

  const mockAccessToken = {
    accessToken: 'mock-jwt-token',
    expiresAt: 100000,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountService,
        {
          provide: getRepositoryToken(Account),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: AccountValidatorService,
          useValue: {
            validateEmailUniqueness: jest.fn(),
            validateEmailExists: jest.fn(),
          },
        },
        {
          provide: PasswordService,
          useValue: {
            hashPassword: jest.fn(),
            comparePassword: jest.fn(),
          },
        },
        {
          provide: JwtAuthService,
          useValue: {
            generateToken: jest.fn().mockReturnValue(mockAccessToken),
            verifyToken: jest.fn(),
            decodeToken: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
            verifyAsync: jest.fn(),
            decode: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: AwsS3Service,
          useValue: {
            uploadFile: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AccountService>(AccountService);
    accountRepository = module.get<Repository<Account>>(
      getRepositoryToken(Account),
    );
    accountValidatorService = module.get<AccountValidatorService>(
      AccountValidatorService,
    );
    passwordService = module.get<PasswordService>(PasswordService);
    jwtAuthService = module.get<JwtAuthService>(JwtAuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    const registerDto: RegisterDto = {
      email: 'test@example.com',
      username: 'testuser',
      password: 'password123',
    };

    it('should successfully register a new account with JWT token', async () => {
      jest
        .spyOn(accountValidatorService, 'validateEmailUniqueness')
        .mockResolvedValue(undefined);
      jest
        .spyOn(passwordService, 'hashPassword')
        .mockResolvedValue('hashedPassword123');
      jest
        .spyOn(accountRepository, 'create')
        .mockReturnValue(mockAccount as Account);
      jest
        .spyOn(accountRepository, 'save')
        .mockResolvedValue(mockAccount as Account);

      // Mock is already set up in the provider, but we can spy on it
      const generateTokenSpy = jest.spyOn(jwtAuthService, 'generateToken');

      // Act
      const result = await service.register(registerDto);

      // Assert
      expect(
        accountValidatorService.validateEmailUniqueness,
      ).toHaveBeenCalledWith(registerDto.email);
      expect(passwordService.hashPassword).toHaveBeenCalledWith(
        registerDto.password,
      );
      expect(accountRepository.create).toHaveBeenCalledWith({
        email: registerDto.email,
        username: registerDto.username,
        password: 'hashedPassword123',
        createdAt: expect.any(Date),
        isActive: true,
      });
      expect(accountRepository.save).toHaveBeenCalledWith(
        mockAccount as Account,
      );
      expect(generateTokenSpy).toHaveBeenCalledWith({
        sub: mockAccount.id!,
        email: mockAccount.email!,
      });
      expect(result).toEqual({
        user: mockAccountWithoutPassword,
        token: mockAccessToken,
      });
    });

    it('should throw ConflictException when email is not unique', async () => {
      // Arrange
      const conflictError = new ConflictException('Email already exists');
      jest
        .spyOn(accountValidatorService, 'validateEmailUniqueness')
        .mockRejectedValue(conflictError);

      // Act & Assert
      await expect(service.register(registerDto)).rejects.toThrow(
        ConflictException,
      );
      expect(
        accountValidatorService.validateEmailUniqueness,
      ).toHaveBeenCalledWith(registerDto.email);
      expect(passwordService.hashPassword).not.toHaveBeenCalled();
      expect(accountRepository.create).not.toHaveBeenCalled();
      expect(accountRepository.save).not.toHaveBeenCalled();
    });

    it('should handle password hashing errors', async () => {
      // Arrange
      const hashingError = new Error('Hashing failed');
      jest
        .spyOn(accountValidatorService, 'validateEmailUniqueness')
        .mockResolvedValue(undefined);
      jest
        .spyOn(passwordService, 'hashPassword')
        .mockRejectedValue(hashingError);

      // Act & Assert
      await expect(service.register(registerDto)).rejects.toThrow(
        'Hashing failed',
      );
      expect(
        accountValidatorService.validateEmailUniqueness,
      ).toHaveBeenCalled();
      expect(passwordService.hashPassword).toHaveBeenCalled();
      expect(accountRepository.create).not.toHaveBeenCalled();
      expect(accountRepository.save).not.toHaveBeenCalled();
    });

    it('should handle database save errors', async () => {
      // Arrange
      const saveError = new Error('Database save failed');
      jest
        .spyOn(accountValidatorService, 'validateEmailUniqueness')
        .mockResolvedValue(undefined);
      jest
        .spyOn(passwordService, 'hashPassword')
        .mockResolvedValue('hashedPassword123');
      jest
        .spyOn(accountRepository, 'create')
        .mockReturnValue(mockAccount as Account);
      jest.spyOn(accountRepository, 'save').mockRejectedValue(saveError);

      // Act & Assert
      await expect(service.register(registerDto)).rejects.toThrow(
        'Database save failed',
      );
      expect(
        accountValidatorService.validateEmailUniqueness,
      ).toHaveBeenCalled();
      expect(passwordService.hashPassword).toHaveBeenCalled();
      expect(accountRepository.create).toHaveBeenCalled();
      expect(accountRepository.save).toHaveBeenCalled();
    });
  });

  describe('login', () => {
    const loginDto: LoginDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should successfully login with valid credentials and return JWT token', async () => {
      // Arrange
      jest
        .spyOn(accountValidatorService, 'validateEmailExists')
        .mockResolvedValue(mockAccount as Account);
      jest
        .spyOn(passwordService, 'comparePassword')
        .mockResolvedValue(undefined);

      // Spy on the already mocked method
      const generateTokenSpy = jest.spyOn(jwtAuthService, 'generateToken');

      // Act
      const result = await service.login(loginDto);

      // Assert
      expect(accountValidatorService.validateEmailExists).toHaveBeenCalledWith(
        loginDto.email,
      );
      expect(passwordService.comparePassword).toHaveBeenCalledWith(
        loginDto.password,
        mockAccount.password!,
      );
      expect(generateTokenSpy).toHaveBeenCalledWith({
        sub: mockAccount.id!,
        email: mockAccount.email!,
      });
      expect(result).toEqual({
        user: mockAccountWithoutPassword,
        token: mockAccessToken,
      });
    });

    it('should throw UnauthorizedException when email does not exist', async () => {
      // Arrange
      const notFoundError = new UnauthorizedException('Invalid credentials');
      jest
        .spyOn(accountValidatorService, 'validateEmailExists')
        .mockRejectedValue(notFoundError);

      // Act & Assert
      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(accountValidatorService.validateEmailExists).toHaveBeenCalledWith(
        loginDto.email,
      );
      expect(passwordService.comparePassword).not.toHaveBeenCalled();
      expect(jwtAuthService.generateToken).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when password is incorrect', async () => {
      // Arrange
      const passwordError = new UnauthorizedException('Incorrect password');
      jest
        .spyOn(accountValidatorService, 'validateEmailExists')
        .mockResolvedValue(mockAccount as Account);
      jest
        .spyOn(passwordService, 'comparePassword')
        .mockRejectedValue(passwordError);

      // Act & Assert
      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(accountValidatorService.validateEmailExists).toHaveBeenCalledWith(
        loginDto.email,
      );
      expect(passwordService.comparePassword).toHaveBeenCalledWith(
        loginDto.password,
        mockAccount.password!,
      );
      expect(jwtAuthService.generateToken).not.toHaveBeenCalled();
    });

    it('should test JWT token generation with correct payload', async () => {
      // Arrange
      jest
        .spyOn(accountValidatorService, 'validateEmailExists')
        .mockResolvedValue(mockAccount as Account);
      jest
        .spyOn(passwordService, 'comparePassword')
        .mockResolvedValue(undefined);
      const generateTokenSpy = jest.spyOn(jwtAuthService, 'generateToken');

      // Act
      await service.login(loginDto);

      // Assert
      expect(generateTokenSpy).toHaveBeenCalledWith({
        sub: mockAccount.id!,
        email: mockAccount.email!,
      });
    });

    it('should return account without password field and with access token', async () => {
      // Arrange
      jest
        .spyOn(accountValidatorService, 'validateEmailExists')
        .mockResolvedValue(mockAccount as Account);
      jest
        .spyOn(passwordService, 'comparePassword')
        .mockResolvedValue(undefined);
      jest
        .spyOn(jwtAuthService, 'generateToken')
        .mockResolvedValue(mockAccessToken);

      // Act
      const result = await service.login(loginDto);

      // Assert
      expect(result.user).not.toHaveProperty('password');
      expect(result).toHaveProperty('token', mockAccessToken);
      expect(result.user).toEqual(
        expect.objectContaining({
          id: mockAccount.id,
          email: mockAccount.email,
          username: mockAccount.username,
          createdAt: mockAccount.createdAt,
          isActive: mockAccount.isActive,
        }),
      );
    });
  });

  describe('JWT token generation', () => {
    const loginDto: LoginDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should generate JWT token with correct payload structure', async () => {
      // Arrange
      const generateTokenSpy = jest.spyOn(jwtAuthService, 'generateToken');
      jest
        .spyOn(accountValidatorService, 'validateEmailExists')
        .mockResolvedValue(mockAccount as Account);
      jest
        .spyOn(passwordService, 'comparePassword')
        .mockResolvedValue(undefined);

      // Act
      await service.login(loginDto);

      // Assert
      expect(generateTokenSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          sub: expect.any(String),
          email: expect.any(String),
        }),
      );
    });

    it('should include correct user information in JWT payload', async () => {
      // Arrange
      const generateTokenSpy = jest.spyOn(jwtAuthService, 'generateToken');
      jest
        .spyOn(accountValidatorService, 'validateEmailExists')
        .mockResolvedValue(mockAccount as Account);
      jest
        .spyOn(passwordService, 'comparePassword')
        .mockResolvedValue(undefined);

      // Act
      await service.login(loginDto);

      // Assert
      expect(generateTokenSpy).toHaveBeenCalledWith({
        sub: mockAccount.id!,
        email: mockAccount.email!,
      });
    });
  });
  describe('updateUsername', () => {
    const userId = '1';
    const updateUsernameDto: UpdateUsernameDto = {
      username: 'newusername',
    };

    it('should successfully update username when new username is different', async () => {
      // Arrange
      const mockAccount = {
        id: userId,
        username: 'oldusername',
        isActive: true,
        updatedAt: new Date(),
      } as Account;

      jest.spyOn(accountRepository, 'findOne').mockResolvedValue(mockAccount);
      jest.spyOn(accountRepository, 'save').mockResolvedValue({
        ...mockAccount,
        username: updateUsernameDto.username,
      } as Account);

      // Act
      const result = await service.updateUsername(userId, updateUsernameDto);

      // Assert
      expect(accountRepository.findOne).toHaveBeenCalledWith({
        where: { id: userId, isActive: true },
      });
      expect(accountRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          username: updateUsernameDto.username,
          updatedAt: expect.any(Date),
        }),
      );
      expect(result).toEqual({ message: 'Username updated successfully' });
    });

    it('should not update username when new username is the same', async () => {
      // Arrange
      const mockAccount = {
        id: userId,
        username: 'newusername', // Same as updateUsernameDto.username
        isActive: true,
        updatedAt: new Date(),
      } as Account;

      jest.spyOn(accountRepository, 'findOne').mockResolvedValue(mockAccount);

      // Act & Assert
      await expect(
        service.updateUsername(userId, updateUsernameDto),
      ).rejects.toThrow(BadRequestException);

      await expect(
        service.updateUsername(userId, updateUsernameDto),
      ).rejects.toThrow('New username must be different from current username');

      // Verify save was never called
      expect(accountRepository.save).not.toHaveBeenCalled();
    });
  });
});
