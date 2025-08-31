import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserPayload } from './jwt.types';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JWTAccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get<string>('ACCESS_TOKEN_SECRET')!,
      issuer: 'grid-wars',
    });
  }

  async validate(payload: UserPayload) {
    return payload;
  }
}
