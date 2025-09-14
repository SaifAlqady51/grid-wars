import { applyDecorators } from '@nestjs/common';
import { ApiExtraModels } from '@nestjs/swagger';
import { Account } from '@account/entity/account.entity';
import {
  UpdateUsernameDto,
  AccountAuthResponse,
  UpdatePasswordDto,
  ApiResponseDto,
  RegisterDto,
  LoginDto,
} from '@account/dto';

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
