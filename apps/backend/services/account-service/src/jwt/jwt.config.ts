import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtConfigService {
  constructor(private configService: ConfigService) {}

  get accessTokenSecret(): string {
    return this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET', 'token');
  }
}
