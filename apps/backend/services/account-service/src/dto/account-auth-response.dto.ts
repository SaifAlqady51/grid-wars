import { ApiProperty } from '@nestjs/swagger';
import { AccountWithoutPassword } from './account-without-password.dto';

export class TokenResponse {
  @ApiProperty({
    description: 'JWT access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string;

  @ApiProperty({
    description: 'Token expiration time in seconds',
    example: 3600,
  })
  expiresAt: number;
}

export class AccountAuthResponse {
  @ApiProperty({
    description: 'User account information without password',
    type: AccountWithoutPassword,
  })
  user: AccountWithoutPassword;

  @ApiProperty({
    description: 'Authentication token',
    type: TokenResponse,
  })
  token: TokenResponse;
}
