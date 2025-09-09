import { OmitType } from '@nestjs/swagger';
import { Account } from '@/entity/account.entity';

export class AccountWithoutPassword extends OmitType(Account, [
  'password',
] as const) { }
