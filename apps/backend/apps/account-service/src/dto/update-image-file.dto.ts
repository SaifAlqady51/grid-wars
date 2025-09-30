import { ApiProperty } from '@nestjs/swagger';
import { type Express } from 'express';

export class UpdateImageFileDto {
  @ApiProperty({
    description: 'Profile image file',
    type: 'string',
    format: 'binary',
    required: true,
  })
  image: Express.Multer.File;
}
