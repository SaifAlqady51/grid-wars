import { AccountAuthResponse } from '@/dto/account-auth-response.dto';
import { LoginDto } from '@/dto/account-login.dto';
import { RegisterDto } from '@/dto/account-register.dto';
import { ApiResponseDto } from '@/dto/api-response';
import { Account } from '@/entity/account.entity';
import { JwtPayload } from '@/security/jwt.decorator';
import { UseAuth } from '@/security/jwt.guard';
import { type UserPayload } from '@/security/jwt.types';
import { AccountService } from '@/services/account.service';
import { Controller, Post, Body, Req, HttpStatus, Get } from '@nestjs/common';

@Controller('accounts')
export class AccountController {
  constructor(private readonly accountService: AccountService) { }

  @Post('register')
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
}
