import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { AwsS3Service } from './aws-s3.service';
import { S3Client } from '@aws-sdk/client-s3';
import { mockClient } from 'aws-sdk-client-mock';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { describe, beforeEach, afterEach, it, expect } from '@jest/globals';
import { type Express } from 'express';
import { Buffer } from 'buffer';
import { Readable } from 'typeorm/platform/PlatformTools.js';

const s3Mock = mockClient(S3Client);

describe('AwsS3Service', () => {
  let service: AwsS3Service;

  const mockConfigService = {
    get: jest.fn(),
  };

  beforeEach(async () => {
    // Reset all mocks before each test
    s3Mock.reset();
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AwsS3Service,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<AwsS3Service>(AwsS3Service);
  });

  afterEach(() => {
    s3Mock.restore();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('constructor', () => {
    it('should initialize with default region when AWS_S3_REGION is not provided', () => {
      mockConfigService.get.mockReturnValue(undefined);

      Test.createTestingModule({
        providers: [
          AwsS3Service,
          {
            provide: ConfigService,
            useValue: mockConfigService,
          },
        ],
      }).compile();

      expect(mockConfigService.get).toHaveBeenCalledWith('AWS_S3_REGION');
    });

    it('should initialize with provided region', () => {
      mockConfigService.get.mockReturnValue('eu-north-1');

      Test.createTestingModule({
        providers: [
          AwsS3Service,
          {
            provide: ConfigService,
            useValue: mockConfigService,
          },
        ],
      }).compile();

      expect(mockConfigService.get).toHaveBeenCalledWith('AWS_S3_REGION');
    });
  });

  describe('uploadFile', () => {
    const mockFile: Express.Multer.File = {
      fieldname: 'file',
      originalname: 'test.jpg',
      encoding: '7bit',
      mimetype: 'image/jpeg',
      size: 1024,
      buffer: Buffer.from('test file content'),
      destination: '',
      filename: '',
      path: '',
      stream: new Readable(),
    };

    const bucketName = 'test-bucket';
    const key = 'test-key.jpg';
    const region = 'eu-north-1';

    beforeEach(() => {
      mockConfigService.get.mockImplementation((configKey: string) => {
        switch (configKey) {
          case 'AWS_S3_BUCKET_NAME':
            return bucketName;
          case 'AWS_S3_REGION':
            return region;
          default:
            return undefined;
        }
      });
    });

    it('should successfully upload file and return URL', async () => {
      // Mock successful S3 response
      s3Mock.on(PutObjectCommand).resolves({
        $metadata: {
          httpStatusCode: 200,
        },
      });

      const result = await service.uploadFile(mockFile, key);

      expect(result).toBe(
        `https://${bucketName}.s3.${region}.amazonaws.com/${key}`,
      );

      // Verify S3 command was called with correct parameters
      expect(s3Mock.commandCalls(PutObjectCommand)).toHaveLength(1);
      const call = s3Mock.commandCalls(PutObjectCommand)[0];
      expect(call.args[0].input).toEqual({
        Bucket: bucketName,
        Key: key,
        Body: mockFile.buffer,
        ContentType: mockFile.mimetype,
        ACL: 'public-read',
      });
    });

    it('should throw error when S3 upload fails with non-200 status', async () => {
      // Mock failed S3 response
      s3Mock.on(PutObjectCommand).resolves({
        $metadata: {
          httpStatusCode: 400,
        },
      });

      await expect(service.uploadFile(mockFile, key)).rejects.toThrow(
        'Failed to upload file to S3',
      );
    });

    it('should throw error when S3 client throws an error', async () => {
      const errorMessage = 'S3 service error';
      s3Mock.on(PutObjectCommand).rejects(new Error(errorMessage));

      await expect(service.uploadFile(mockFile, key)).rejects.toThrow(
        errorMessage,
      );
    });

    it('should handle missing bucket name configuration', async () => {
      mockConfigService.get.mockImplementation((configKey: string) => {
        switch (configKey) {
          case 'AWS_S3_BUCKET_NAME':
            return undefined;
          case 'AWS_S3_REGION':
            return region;
          default:
            return undefined;
        }
      });

      s3Mock.on(PutObjectCommand).resolves({
        $metadata: {
          httpStatusCode: 200,
        },
      });

      const result = await service.uploadFile(mockFile, key);

      // Should still work but with undefined bucket name in URL
      expect(result).toBe(
        `https://undefined.s3.${region}.amazonaws.com/${key}`,
      );
    });

    it('should use correct content type from file', async () => {
      const pdfFile: Express.Multer.File = {
        ...mockFile,
        mimetype: 'application/pdf',
        originalname: 'document.pdf',
      };

      s3Mock.on(PutObjectCommand).resolves({
        $metadata: {
          httpStatusCode: 200,
        },
      });

      await service.uploadFile(pdfFile, 'document.pdf');

      const call = s3Mock.commandCalls(PutObjectCommand)[0];
      expect(call.args[0].input.ContentType).toBe('application/pdf');
    });

    it('should preserve file buffer content', async () => {
      const customBuffer = Buffer.from('custom file content');
      const customFile: Express.Multer.File = {
        ...mockFile,
        buffer: customBuffer,
      };

      s3Mock.on(PutObjectCommand).resolves({
        $metadata: {
          httpStatusCode: 200,
        },
      });

      await service.uploadFile(customFile, key);

      const call = s3Mock.commandCalls(PutObjectCommand)[0];
      expect(call.args[0].input.Body).toBe(customBuffer);
    });
  });
});
