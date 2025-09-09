import { applyDecorators } from '@nestjs/common';
import { ApiExtraModels } from '@nestjs/swagger';
import { Account } from '../entity/account.entity';
import { UpdateUsernameDto } from '../dto/update-username.dto';
import { UpdatePasswordDto } from '../dto/update-password.dto';
import { AccountAuthResponse } from '../dto/account-auth-response.dto';
import { ApiResponseDto } from '../dto/api-response.dto';
import { RegisterDto } from '@/dto/account-register.dto';
import { LoginDto } from '@/dto/account-login.dto';

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
