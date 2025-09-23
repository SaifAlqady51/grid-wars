import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordService {
  private readonly saltRounds = 12;
  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, this.saltRounds);
  }

  async comparePassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<void> {
    const correctPassword = await bcrypt.compare(plainPassword, hashedPassword);
    if (!correctPassword) {
      throw new UnauthorizedException('Credentials are incorrect');
    }
  }

  validatePasswordStrength(password: string): boolean {
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return strongPasswordRegex.test(password);
  }

  async isPasswordDifferentFromPrevious(
    newPassword: string,
    oldHashedPassword: string,
  ): Promise<boolean> {
    const isSame = await bcrypt.compare(newPassword, oldHashedPassword);
    if (isSame) {
      throw new BadRequestException(
        'New password must be different from current password',
      );
    }
    return true;
  }
  validatePasswordConfirmation(
    newPassword: string,
    confirmPassword: string,
  ): void {
    if (newPassword !== confirmPassword) {
      throw new BadRequestException(
        'New password and confirmation do not match',
      );
    }
  }
}
