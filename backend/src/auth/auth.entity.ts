import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AccessToken {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  access_token: string;
}
