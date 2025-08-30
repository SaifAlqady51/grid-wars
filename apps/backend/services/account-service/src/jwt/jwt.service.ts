import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserPayload } from './jwt.types';
import ms, { StringValue } from 'ms';

@Injectable()
export class JwtAuthService {
  secret: string;
  expirationMs: number;
  constructor(
    private readonly jwtService: NestJwtService,
    private readonly configService: ConfigService,
  ) {
    this.expirationMs = ms(
      this.configService.get('ACCESS_TOKEN_EXPIRATION') as StringValue,
    );
  }

  async generateToken({
    sub: id,
    email,
  }: UserPayload): Promise<{ accessToken: string; expiresAt: number }> {
    const payload: UserPayload = {
      sub: id,
      email: email,
    };

    const expiresAt = Date.now() + this.expirationMs;

    const token = this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN', '7d'),
    });

    return {
      accessToken: `Bearer ${token}`,
      expiresAt,
    };
  }

  async verifyToken(token: string): Promise<UserPayload> {
    return this.jwtService.verifyAsync<UserPayload>(token, {
      secret: this.configService.get<string>('JWT_SECRET'),
    });
  }
}
