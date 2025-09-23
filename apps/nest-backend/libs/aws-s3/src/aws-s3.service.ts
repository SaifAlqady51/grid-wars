import { Injectable } from '@nestjs/common';
import { S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { type Express } from 'express';
import { PutObjectCommand, PutObjectCommandInput } from '@aws-sdk/client-s3';
import { Logger } from '@nestjs/common';

@Injectable()
export class AwsS3Service {
  private logger = new Logger(AwsS3Service.name);
  private region: string;
  private s3Client: S3Client;

  constructor(private configService: ConfigService) {
    this.region =
      this.configService.get<string>('AWS_S3_REGION') || 'eu-north-1';
    this.s3Client = new S3Client({
      region: this.region,
    });
  }
  async uploadFile(file: Express.Multer.File, key: string): Promise<string> {
    const bucketName = this.configService.get<string>('AWS_S3_BUCKET_NAME');
    const input: PutObjectCommandInput = {
      Bucket: bucketName,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read',
    };
    try {
      const response = await this.s3Client.send(new PutObjectCommand(input));
      if (response.$metadata.httpStatusCode === 200) {
        return `https://${bucketName}.s3.${this.region}.amazonaws.com/${key}`;
      }
      throw new Error('Failed to upload file to S3');
    } catch (error) {
      this.logger.error('Error uploading file to S3', error);
      throw error;
    }
  }
}
