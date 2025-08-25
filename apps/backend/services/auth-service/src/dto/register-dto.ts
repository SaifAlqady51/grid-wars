import {
  IsString,
  IsEmail,
  MinLength,
  MaxLength,
  Matches,
  IsOptional,
  ValidationError,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class RegisterDto {
  @ApiProperty({
    description: 'Username must be 3-50 characters, letters and numbers only',
    example: 'john_doe123',
  })
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  @Matches(/^[a-zA-Z0-9_]+$/)
  @Type(() => String)
  username!: string;

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

  @ApiProperty({
    description: 'Optional display name for the user',
    example: 'John Doe',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Matches(/^[a-zA-Z0-9_\- ]+$/)
  @Type(() => String)
  display_name?: string;
}

// Type-safe error handling utilities
export class ValidationErrorHandler {
  static getValidationMessages(errors: unknown): string[] {
    if (!Array.isArray(errors)) {
      return ['Invalid validation errors format'];
    }

    const messages: string[] = [];

    for (const error of errors) {
      if (this.isValidationError(error)) {
        if (error.constraints) {
          const constraintValues = Object.values(error.constraints);
          messages.push(
            ...constraintValues.filter(
              (msg): msg is string => typeof msg === 'string',
            ),
          );
        }

        if (error.children && error.children.length > 0) {
          const childMessages = this.getValidationMessages(error.children);
          messages.push(...childMessages);
        }
      }
    }

    return messages;
  }

  private static isValidationError(error: unknown): error is ValidationError {
    return (
      typeof error === 'object' &&
      error !== null &&
      'property' in error &&
      'target' in error
    );
  }
}

// Safe error type guard
export function isError(error: unknown): error is Error {
  return error instanceof Error;
}

// Safe error message extraction
export function getErrorMessage(error: unknown): string {
  if (isError(error)) {
    return error.message;
  }

  if (typeof error === 'string') {
    return error;
  }

  if (typeof error === 'object' && error !== null) {
    const errorObj = error as Record<string, unknown>;
    if (typeof errorObj.message === 'string') {
      return errorObj.message;
    }

    try {
      return JSON.stringify(error);
    } catch {
      return 'Unknown error (unable to stringify)';
    }
  }

  return 'Unknown error occurred';
}
