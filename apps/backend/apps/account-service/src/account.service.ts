import {
  AccountAuthResponse,
  LoginDto,
  RegisterDto,
  UpdatePasswordDto,
  UpdateUsernameDto,
} from './dto';
import { Account } from './entity/account.entity';
import { AccountValidatorService, PasswordService } from './validation';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { type Express } from 'express';
import { AwsS3Service } from '@grid-wars/aws-s3';
import { JwtAuthService } from '@grid-wars/jwt';
@Injectable()
export class AccountService {
  private readonly logger = new Logger(AccountService.name);
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    private readonly accountValidatorService: AccountValidatorService,
    private readonly passwordService: PasswordService,
    private readonly jwtAuthService: JwtAuthService,
    private readonly awsS3Service: AwsS3Service,
  ) { }

  async register(registerDto: RegisterDto): Promise<AccountAuthResponse> {
    await this.accountValidatorService.validateEmailUniqueness(
      registerDto.email,
    );

    const hashedPassword = await this.passwordService.hashPassword(
      registerDto.password,
    );

    const account = this.accountRepository.create({
      email: registerDto.email,
      username: registerDto.username,
      password: hashedPassword,
      createdAt: new Date(),
      isActive: true,
    });

    const { accessToken, expiresAt } = await this.jwtAuthService.generateToken({
      sub: account.id,
      email: account.email,
    });

    const savedAccount = await this.accountRepository.save(account);
    const { password: _password, ...accountWithoutPassword } = savedAccount;

    return {
      user: accountWithoutPassword,
      token: { accessToken: accessToken, expiresAt: expiresAt },
    };
  }
  async login(loginDto: LoginDto): Promise<AccountAuthResponse> {
    const account = await this.accountValidatorService.validateEmailExists(
      loginDto.email,
    );

    await this.passwordService.comparePassword(
      loginDto.password,
      account.password!,
    );
    const { accessToken, expiresAt } = await this.jwtAuthService.generateToken({
      sub: account.id!,
      email: account.email!,
    });

    const { password: _password, ...accountWithoutPassword } = account;
    return { user: accountWithoutPassword, token: { accessToken, expiresAt } };
  }

  async getProfile(userId: string): Promise<Omit<Account, 'password'>> {
    const account = await this.accountRepository.findOne({
      where: { id: userId, isActive: true },
      select: [
        'id',
        'username',
        'email',
        'wins',
        'losses',
        'draws',
        'streakDays',
        'createdAt',
        'updatedAt',
      ],
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    return {
      id: account.id,
      username: account.username,
      email: account.email,
      wins: account.wins,
      losses: account.losses,
      draws: account.draws,
      streakDays: account.streakDays,
      createdAt: account.createdAt,
      updatedAt: account.updatedAt,
      isActive: account.isActive,
      totalGames: account.totalGames,
      profileImage: account.profileImage,
      level: account.level,
    };
  }
  async updateUsername(
    userId: string,
    updateUsernameDto: UpdateUsernameDto,
  ): Promise<{ message: string }> {
    const account = await this.accountRepository.findOne({
      where: { id: userId, isActive: true },
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    if (account.username === updateUsernameDto.username) {
      throw new BadRequestException(
        'New username must be different from current username',
      );
    }

    account.username = updateUsernameDto.username;
    account.updatedAt = new Date();

    await this.accountRepository.save(account);

    return { message: 'Username updated successfully' };
  }

  async updatePassword(
    userId: string,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<{ message: string }> {
    const account = await this.accountRepository.findOne({
      where: { id: userId, isActive: true },
    });

    if (!account) {
      throw new NotFoundException('Account not found');
    }

    await this.passwordService.comparePassword(
      updatePasswordDto.currentPassword,
      account.password!,
    );

    await this.passwordService.isPasswordDifferentFromPrevious(
      updatePasswordDto.newPassword,
      account.password,
    );

    this.passwordService.validatePasswordConfirmation(
      updatePasswordDto.newPassword,
      updatePasswordDto.confirmPassword,
    );

    const hashedPassword = await this.passwordService.hashPassword(
      updatePasswordDto.newPassword,
    );

    account.password = hashedPassword;
    account.updatedAt = new Date();

    await this.accountRepository.save(account);

    return { message: 'Password updated successfully' };
  }
  async uploadProfileImage(
    userId: string,
    file: Express.Multer.File,
  ): Promise<{ message: string }> {
    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/webp',
      'image/gif',
    ];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new Error(
        'Invalid file type. Only JPEG, PNG, WebP, and GIF images are allowed.',
      );
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new Error('File size too large. Maximum allowed size is 5MB.');
    }

    const timestamp = Date.now();
    const fileExtension = file.originalname.split('.').pop() || 'jpg';
    const key = `profile-${userId}-${timestamp}.${fileExtension}`;

    try {
      const url = await this.awsS3Service.uploadFile(file, key);
      await this.accountRepository.update(userId, { profileImage: url });
      return { message: ' Profile image uploaded successfully' };
    } catch (error) {
      this.logger.error('Error uploading profile image', error);
      throw new InternalServerErrorException('Failed to upload profile image');
    }
  }
}
