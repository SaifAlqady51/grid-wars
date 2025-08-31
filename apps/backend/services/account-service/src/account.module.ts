import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport'; // Add this import
import { AccountValidatorService } from './validation/account-validator';
import { PasswordService } from '@/validation/password-validator';
import { Account } from '@/entity/account.entity';
import { JWTAccessTokenStrategy, JwtAuthService } from '@/jwt';
import { AccountController } from '@/controllers/account.controller';
import { AccountService } from '@/services/account.service';
import { JwtAuthGuard } from './jwt/jwt-auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [Account],
        synchronize: configService.get('DB_SYNCHRONIZE', 'true') === 'true',
        logging: configService.get('NODE_ENV') === 'development',
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Account]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        signOptions: {
          expiresIn: configService.get<string>('ACCESS_TOKEN_EXPIRATION', '7d'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AccountController],
  providers: [
    AccountService,
    AccountValidatorService,
    PasswordService,
    JwtAuthService,
    JWTAccessTokenStrategy,
    JwtAuthGuard,
  ],
  exports: [JwtAuthService, JWTAccessTokenStrategy],
})
export class AccountModule { }
