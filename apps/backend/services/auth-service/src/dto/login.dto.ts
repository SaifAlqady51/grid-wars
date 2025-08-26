import { IsString, IsEmail, MinLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
export class LoginDto {
  @ApiProperty({
    description: 'Valid email address',
    example: 'john.doe@example.com',
  })
  @IsEmail({})
  @Type(() => String)
  email!: string;

  @ApiProperty({
    description:
      'Password must be at least 8 characters with uppercase, lowercase, number, and special character',
    example: 'SecurePass123!',
  })
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
  @Type(() => String)
  password!: string;
}
