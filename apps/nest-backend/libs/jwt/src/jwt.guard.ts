import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from './jwt-auth.guard';

export const UseAuth = applyDecorators(
  ApiBearerAuth('access-token'),
  UseGuards(JwtAuthGuard),
);
