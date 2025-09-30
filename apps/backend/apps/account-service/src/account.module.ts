import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { resolve } from 'path';
import { AccountValidatorService } from './validation/account-validator';
import { PasswordService } from './validation';
import { Account } from './entity/account.entity';
import { JwtAuthModule } from '@grid-wars/jwt';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';
import { AwsS3Service } from '@grid-wars/aws-s3';
import * as process from 'process';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [resolve(process.cwd(), 'apps/account-service/.env')],
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
    JwtAuthModule.forRootAsync({ isGlobal: false }),
  ],
  controllers: [AccountController],
  providers: [
    AccountService,
    AwsS3Service,
    AccountValidatorService,
    PasswordService,
  ],
})
export class AccountModule { }
