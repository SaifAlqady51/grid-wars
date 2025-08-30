import { ApiProperty } from '@nestjs/swagger';

export class UpdateUsernameDto {
  @ApiProperty({
    description: 'New username',
    type: String,
  })
  username: string;
}
