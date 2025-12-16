import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class CompleteGameRequestDto {
  @ApiProperty({ example: 'c3f579b3-97dd-80da-f4c7-7635a0ca60fb' })
  @IsUUID()
  gameId: string;
}
