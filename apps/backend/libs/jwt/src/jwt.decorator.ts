import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserPayload } from './jwt.types';

export const JwtPayload = createParamDecorator(
  (_, context: ExecutionContext): UserPayload => {
    const request = context.switchToHttp().getRequest();
    return request.user;
  },
);
