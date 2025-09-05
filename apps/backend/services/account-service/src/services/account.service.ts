import { AccountAuthResponse } from '@/dto/account-auth-response.dto';
import { LoginDto } from '@/dto/account-login.dto';
import { RegisterDto } from '@/dto/account-register.dto';
import { UpdatePasswordDto } from '@/dto/update-password.dto';
import { UpdateUsernameDto } from '@/dto/update-username.dto';
import { Account } from '@/entity/account.entity';
import { JwtAuthService } from '@/jwt/jwt.service';
import { AccountValidatorService } from '@/validation/account-validator';
import { PasswordService } from '@/validation/password-validator';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    private readonly accountValidatorService: AccountValidatorService,
    private readonly passwordService: PasswordService,
    private readonly jwtAuthService: JwtAuthService,
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
    };
  }
  async updateUsername(
    userId: string,
    updateUsernameDto: UpdateUsernameDto,
  ): Promise<Omit<Account, 'password'>> {
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

    const updatedAccount = await this.accountRepository.save(account);

    const { password: _password, ...accountWithoutPassword } = updatedAccount;
    return accountWithoutPassword;
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
}
