import { DynamicModule, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { resolve } from 'path';
import { config } from 'dotenv';
import { JwtAuthService } from './jwt.service';
import { JWTAccessTokenStrategy } from './jwt.strategy';
import { JwtAuthGuard } from './jwt-auth.guard';
import * as process from 'process';

export interface JwtAuthModuleOptions {
  isGlobal?: boolean;
}

@Module({})
export class JwtAuthModule {
  static forRootAsync(options?: JwtAuthModuleOptions): DynamicModule {
    config({
      path: resolve(process.cwd(), 'libs/jwt/.env'),
      override: false,
    });

    return {
      module: JwtAuthModule,
      global: options?.isGlobal || false,
      imports: [
        ConfigModule.forRoot({
          envFilePath: [resolve(process.cwd(), 'libs/jwt/.env')],
          isGlobal: false,
        }),
        JwtModule.registerAsync({
          imports: [ConfigModule],
          useFactory: async (configService: ConfigService) => ({
            secret: configService.get<string>('JWT_SECRET'),
            signOptions: {
              expiresIn: configService.get<string>('JWT_EXPIRES_IN', '1h'),
            },
          }),
          inject: [ConfigService],
        }),
      ],
      providers: [JwtAuthService, JWTAccessTokenStrategy, JwtAuthGuard],
      exports: [
        JwtAuthService,
        JWTAccessTokenStrategy,
        JwtAuthGuard,
        JwtModule,
      ],
    };
  }
}
