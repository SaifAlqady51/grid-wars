import { applyDecorators } from '@nestjs/common';
import { ApiExtraModels } from '@nestjs/swagger';
import { Account } from '../entity/account.entity';
import {
  UpdateUsernameDto,
  AccountAuthResponse,
  UpdatePasswordDto,
  RegisterDto,
  LoginDto,
} from '../dto';
import { ApiResponseDto } from '@grid-wars/common/dto';

export function IncludeAllModels() {
  return applyDecorators(
    ApiExtraModels(Account),
    ApiExtraModels(RegisterDto),
    ApiExtraModels(LoginDto),
    ApiExtraModels(UpdateUsernameDto),
    ApiExtraModels(UpdatePasswordDto),
    ApiExtraModels(AccountAuthResponse),
    ApiExtraModels(ApiResponseDto),
  );
}
