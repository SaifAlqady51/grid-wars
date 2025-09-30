import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Account } from '../entity/account.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AccountValidatorService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) { }

  async validateEmailUniqueness(email: string): Promise<void> {
    const existingEmail = await this.accountRepository.findOne({
      where: { email },
    });

    if (existingEmail) {
      throw new ConflictException('Email already registered');
    }
  }

  async validateEmailExists(email: string): Promise<Account> {
    const account = await this.accountRepository.findOne({
      where: { email },
    });

    if (!account) {
      throw new UnauthorizedException('Credentials are incorrect');
    }
    return account;
  }
}
