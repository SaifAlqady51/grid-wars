import { IsString, IsNotEmpty, MinLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePasswordDto {
  @ApiProperty({
    description: 'Current password for verification',
    example: 'currentPassword123!',
  })
  @IsString()
  @IsNotEmpty()
  currentPassword: string;

  @ApiProperty({
    description:
      'New password (min 8 characters, at least 1 letter, 1 number, and 1 special character)',
    example: 'newPassword123!',
    minLength: 8,
  })
  @IsString()
  @MinLength(8)
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]/, {
    message:
      'Password must contain at least 1 letter, 1 number, and 1 special character',
  })
  @IsNotEmpty({ message: 'NewPassword is Required ' })
  newPassword: string;

  @ApiProperty({
    description: 'Confirmation of new password',
    example: 'newPassword123!',
  })
  @IsString()
  @IsNotEmpty({ message: 'confirmPassword is Required ' })
  confirmPassword: string;
}
