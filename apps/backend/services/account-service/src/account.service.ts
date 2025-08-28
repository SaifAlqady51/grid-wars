import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto/user-register.dto';
import { Account } from './entity/account.entity';
import { AccountValidatorService } from './validation/account-validator';
import { PasswordService } from './validation/password-validator';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    private readonly accountValidatorService: AccountValidatorService,
    private readonly passwordService: PasswordService,
  ) { }

  async register(registerDto: RegisterDto): Promise<Partial<Account>> {
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

    const savedAccount = await this.accountRepository.save(account);
    const { password: _password, ...accountWithoutPassword } = savedAccount;

    return accountWithoutPassword;
  }
}
