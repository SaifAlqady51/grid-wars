import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AccountValidatorService } from './validation/account-validator';
import { PasswordService } from '@account/validation/';
import { Account } from '@account/entity/account.entity';
import { JWTAccessTokenStrategy, JwtAuthService } from '@account/jwt';
import { AccountController } from '@account/account.controller';
import { AccountService } from '@account/account.service';
import { JwtAuthGuard } from '@account/jwt';
import { FileUploadService } from '@file-upload/file-upload.service';
import { FileUploadModule } from '@file-upload/file-upload.module';
import { AwsS3Service } from '@aws-s3/aws-s3.service';

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
      imports: [ConfigModule, FileUploadModule],
      useFactory: async (configService: ConfigService) => ({
        signOptions: {
          expiresIn: configService.get<string>('ACCESS_TOKEN_EXPIRATION', '7d'),
        },
      }),
      inject: [ConfigService],
    }),
    FileUploadModule,
  ],
  controllers: [AccountController],
  providers: [
    AccountService,
    FileUploadService,
    AwsS3Service,
    AccountValidatorService,
    PasswordService,
    JwtAuthService,
    JWTAccessTokenStrategy,
    JwtAuthGuard,
  ],
  exports: [JwtAuthService, JWTAccessTokenStrategy],
})
export class AccountModule { }
