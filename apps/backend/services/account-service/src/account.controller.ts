import { Controller, Post, Body, Req, HttpStatus } from '@nestjs/common';
import { AccountService } from './app.service';
import { RegisterDto } from './dto/user-register.dto';
import { ApiResponseDto } from './dto/api-response';
import { Account } from './entity/account.entity';

@Controller('accounts')
export class AccountController {
  constructor(private readonly accountService: AccountService) { }

  @Post('register')
  async register(
    @Body() registerDto: RegisterDto,
    @Req() request: Request,
  ): Promise<ApiResponseDto<Partial<Account>>> {
    const account = await this.accountService.register(registerDto);
    return new ApiResponseDto<Partial<Account>>({
      data: account,
      message: 'Account created successfully',
      error: false,
      timestamp: new Date().toISOString(),
      path: request.url,
      status: HttpStatus.CREATED,
    });
  }
}
