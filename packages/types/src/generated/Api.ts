/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface Account {
  /**
   * Unique identifier (UUID)
   * @example "123e4567-e89b-12d3-a456-426614174000"
   */
  id: string;
  /**
   * Username (3-50 characters)
   * @minLength 3
   * @maxLength 50
   * @example "john_doe"
   */
  username: string;
  /**
   * Email address
   * @example "user@example.com"
   */
  email: string;
  /**
   * Profile image URL
   * @example "https://example.com/profile.jpg"
   */
  profileImage: string | null;
  /**
   * Number of wins
   * @default 0
   * @example 5
   */
  wins: number;
  /**
   * Number of losses
   * @default 0
   * @example 3
   */
  losses: number;
  /**
   * Number of draws
   * @default 0
   * @example 2
   */
  draws: number;
  /**
   * Total games played
   * @default 0
   * @example 10
   */
  totalGames: number;
  /**
   * Account level
   * @default 1
   * @example 5
   */
  level: number;
  /**
   * Account creation timestamp
   * @format date-time
   * @example "2024-01-01T00:00:00.000Z"
   */
  createdAt: string;
  /**
   * Account last update timestamp
   * @format date-time
   * @example "2024-01-01T00:00:00.000Z"
   */
  updatedAt: string;
  /**
   * Whether the account is active
   * @default true
   * @example true
   */
  isActive: boolean;
  /**
   * Current streak days
   * @default 0
   * @example 7
   */
  streakDays: number;
}

export interface RegisterDto {
  /**
   * User email address
   * @example "user@example.com"
   */
  email: string;
  /**
   * Username (3-20 characters, letters, numbers, underscores only)
   * @example "john_doe"
   */
  username: string;
  /**
   * password (min 8 characters, at least 1 letter, 1 number, and 1 special character)
   * @minLength 8
   * @example "Password123!"
   */
  password: string;
}

export interface LoginDto {
  /**
   * Email address for login
   * @example "user@example.com"
   */
  email?: string;
  /**
   * User password
   * @example "Password123!"
   */
  password: string;
}

export interface UpdateUsernameDto {
  /** New username */
  username: string;
}

export interface UpdatePasswordDto {
  /**
   * Current password for verification
   * @example "currentPassword123!"
   */
  currentPassword: string;
  /**
   * New password (min 8 characters, at least 1 letter, 1 number, and 1 special character)
   * @minLength 8
   * @example "newPassword123!"
   */
  newPassword: string;
  /**
   * Confirmation of new password
   * @example "newPassword123!"
   */
  confirmPassword: string;
}

export interface AccountWithoutPassword {
  /**
   * Unique identifier (UUID)
   * @example "123e4567-e89b-12d3-a456-426614174000"
   */
  id: string;
  /**
   * Username (3-50 characters)
   * @minLength 3
   * @maxLength 50
   * @example "john_doe"
   */
  username: string;
  /**
   * Email address
   * @example "user@example.com"
   */
  email: string;
  /**
   * Profile image URL
   * @example "https://example.com/profile.jpg"
   */
  profileImage: string | null;
  /**
   * Number of wins
   * @default 0
   * @example 5
   */
  wins: number;
  /**
   * Number of losses
   * @default 0
   * @example 3
   */
  losses: number;
  /**
   * Number of draws
   * @default 0
   * @example 2
   */
  draws: number;
  /**
   * Total games played
   * @default 0
   * @example 10
   */
  totalGames: number;
  /**
   * Account level
   * @default 1
   * @example 5
   */
  level: number;
  /**
   * Account creation timestamp
   * @format date-time
   * @example "2024-01-01T00:00:00.000Z"
   */
  createdAt: string;
  /**
   * Account last update timestamp
   * @format date-time
   * @example "2024-01-01T00:00:00.000Z"
   */
  updatedAt: string;
  /**
   * Whether the account is active
   * @default true
   * @example true
   */
  isActive: boolean;
  /**
   * Current streak days
   * @default 0
   * @example 7
   */
  streakDays: number;
}

export interface TokenResponse {
  /**
   * JWT access token
   * @example "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
   */
  accessToken: string;
  /**
   * Token expiration time in seconds
   * @example 3600
   */
  expiresAt: number;
}

export interface AccountAuthResponse {
  /** User account information without password */
  user: AccountWithoutPassword;
  /** Authentication token */
  token: TokenResponse;
}

export interface ApiResponseDto {
  /** Response data payload */
  data: object | null;
  /**
   * Human-readable message describing the result
   * @example "Operation completed successfully"
   */
  message: string;
  /**
   * Indicates if the request resulted in an error
   * @example false
   */
  error: boolean;
  /**
   * Timestamp when the response was generated
   * @example "2023-12-01T10:30:45.123Z"
   */
  timestamp: string;
  /**
   * API endpoint path that was called
   * @example "/api/v1/users"
   */
  path: string;
  /**
   * HTTP status code
   * @example 200
   */
  status: ApiResponseDtoStatusEnum;
}

/**
 * HTTP status code
 * @example 200
 */
export type ApiResponseDtoStatusEnum =
  | 100
  | 101
  | 102
  | 103
  | 200
  | 201
  | 202
  | 203
  | 204
  | 205
  | 206
  | 207
  | 208
  | 210
  | 300
  | 301
  | 302
  | 303
  | 304
  | 307
  | 308
  | 400
  | 401
  | 402
  | 403
  | 404
  | 405
  | 406
  | 407
  | 408
  | 409
  | 410
  | 411
  | 412
  | 413
  | 414
  | 415
  | 416
  | 417
  | 418
  | 421
  | 422
  | 423
  | 424
  | 428
  | 429
  | 456
  | 500
  | 501
  | 502
  | 503
  | 504
  | 505
  | 507
  | 508;
