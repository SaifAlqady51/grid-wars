import { OmitType } from '@nestjs/swagger';
import { Account } from '@account/entity/account.entity';

export class AccountWithoutPassword extends OmitType(Account, [
  'password',
] as const) { }
