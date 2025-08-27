import { ApiProperty } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';

export class ApiResponseDto<T> {
  @ApiProperty({
    description: 'Response data payload',
    nullable: true,
  })
  data: T | null;

  @ApiProperty({
    example: 'Operation completed successfully',
    description: 'Human-readable message describing the result',
  })
  message: string;

  @ApiProperty({
    example: false,
    description: 'Indicates if the request resulted in an error',
  })
  error: boolean;

  @ApiProperty({
    example: '2023-12-01T10:30:45.123Z',
    description: 'Timestamp when the response was generated',
  })
  timestamp: string;

  @ApiProperty({
    example: '/api/v1/users',
    description: 'API endpoint path that was called',
  })
  path: string;

  @ApiProperty({
    example: 200,
    description: 'HTTP status code',
    enum: HttpStatus,
  })
  status: number;

  constructor(partial: Partial<ApiResponseDto<T>>) {
    Object.assign(this, partial);
  }
}
