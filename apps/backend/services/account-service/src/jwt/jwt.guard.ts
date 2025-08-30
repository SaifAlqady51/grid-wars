import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';

export const JWTAccessTokenGuard = AuthGuard('jwt');

export const UseAuth = applyDecorators(
  ApiBearerAuth('access-token'),
  UseGuards(JWTAccessTokenGuard),
);
