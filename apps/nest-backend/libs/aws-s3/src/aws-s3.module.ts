import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { resolve } from 'path';
import { AwsS3Service } from './aws-s3.service';
import * as process from 'process';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [resolve(process.cwd(), 'libs/aws-s3/.env')],
      isGlobal: false,
      cache: true,
    }),
  ],
  providers: [AwsS3Service],
  exports: [AwsS3Service, ConfigModule],
})
export class AwsS3Module { }
