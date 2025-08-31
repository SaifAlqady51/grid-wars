import { ApiProperty } from '@nestjs/swagger';
import { Account } from 'src/entity/account.entity';

export class AccountAuthResponse {
  @ApiProperty({
    description: 'User account information without password',
    type: Account,
  })
  user: Partial<Account>;

  @ApiProperty({
    description: 'Authentication token',
    example: {
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      expiresAt: 3600,
    },
  })
  token: {
    accessToken: string;
    expiresAt: number;
  };
}
