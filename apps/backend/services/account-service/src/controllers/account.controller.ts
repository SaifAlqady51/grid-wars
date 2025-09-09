import { IncludeAllModels } from '@/decorators/swagger-decorator';
import { AccountAuthResponse } from '@/dto/account-auth-response.dto';
import { LoginDto } from '@/dto/account-login.dto';
import { RegisterDto } from '@/dto/account-register.dto';
import { ApiResponseDto } from '@/dto/api-response.dto';
import { UpdatePasswordDto } from '@/dto/update-password.dto';
import { UpdateUsernameDto } from '@/dto/update-username.dto';
import { Account } from '@/entity/account.entity';
import { JwtPayload, UseAuth, type UserPayload } from '@/jwt';
import { AccountService } from '@/services/account.service';
import {
  Controller,
  Post,
  Body,
  Req,
  HttpStatus,
  Get,
  Patch,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('accounts')
@IncludeAllModels()
export class AccountController {
  constructor(private readonly accountService: AccountService) { }

  @Post('register')
  @ApiOperation({ summary: 'Register a new account' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Account created successfully',
    type: ApiResponseDto<AccountAuthResponse>,
  })
  async register(
    @Body() registerDto: RegisterDto,
    @Req() request: Request,
  ): Promise<ApiResponseDto<AccountAuthResponse>> {
    const registerResult = await this.accountService.register(registerDto);
    return new ApiResponseDto<AccountAuthResponse>({
      data: registerResult,
      message: 'Account created successfully',
      error: false,
      timestamp: new Date().toISOString(),
      path: request.url,
      status: HttpStatus.CREATED,
    });
  }
  @Post('login')
  @ApiOperation({ summary: 'Login to account' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Login successful',
    type: ApiResponseDto<AccountAuthResponse>,
  })
  async login(
    @Body() loginDto: LoginDto,
    @Req() request: Request,
  ): Promise<ApiResponseDto<AccountAuthResponse>> {
    const loginResult = await this.accountService.login(loginDto);

    return new ApiResponseDto({
      data: loginResult,
      message: 'Login successful',
      error: false,
      timestamp: new Date().toISOString(),
      path: request.url,
      status: HttpStatus.OK,
    });
  }

  @Get('profile')
  @UseAuth
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({
    status: 200,
    description: 'Profile retrieved successfully',
    type: ApiResponseDto<Account>,
  })
  async getProfile(
    @JwtPayload() { sub }: UserPayload,
  ): Promise<ApiResponseDto<Omit<Account, 'password'>>> {
    const profile = await this.accountService.getProfile(sub);
    return new ApiResponseDto<Omit<Account, 'password'>>({
      data: profile,
      message: 'Profile retrieved successfully',
      error: false,
      timestamp: new Date().toISOString(),
      status: HttpStatus.OK,
    });
  }

  @Patch('update-username')
  @UseAuth
  @ApiOperation({ summary: 'Update uesrname' })
  @ApiResponse({
    status: 200,
    description: 'Username updated successfully',
    type: ApiResponseDto<Account>,
  })
  async updateUsername(
    @Body() username: UpdateUsernameDto,
    @JwtPayload() { sub }: UserPayload,
  ): Promise<ApiResponseDto<Omit<Account, 'password'>>> {
    const updatedAccount = await this.accountService.updateUsername(
      sub,
      username,
    );
    return new ApiResponseDto<Omit<Account, 'password'>>({
      data: updatedAccount,
      message: 'Username updated successfully',
      error: false,
      timestamp: new Date().toISOString(),
      status: HttpStatus.OK,
    });
  }

  @Patch('update-password')
  @UseAuth
  @ApiOperation({ summary: 'Update password' })
  @ApiResponse({
    status: 200,
    description: 'Password updated successfully',
    type: ApiResponseDto<Account>,
  })
  async updatePassword(
    @Body() password: UpdatePasswordDto,
    @JwtPayload() { sub }: UserPayload,
  ): Promise<ApiResponseDto<null>> {
    const updatePasswordMessage = await this.accountService.updatePassword(
      sub,
      password,
    );
    return new ApiResponseDto<null>({
      message: updatePasswordMessage.message,
      error: false,
      timestamp: new Date().toISOString(),
      status: HttpStatus.OK,
    });
  }
}
