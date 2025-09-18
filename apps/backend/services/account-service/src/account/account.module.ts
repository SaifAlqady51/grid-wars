import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { AccountValidatorService } from './validation/account-validator';
import { PasswordService } from '@account/validation/';
import { Account } from '@account/entity/account.entity';
import { JwtAuthModule } from '@grid-wars/jwt';
import { AccountController } from '@account/account.controller';
import { AccountService } from '@account/account.service';
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
    JwtAuthModule.forRootAsync({ isGlobal: false }), // Use the dynamic module
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
