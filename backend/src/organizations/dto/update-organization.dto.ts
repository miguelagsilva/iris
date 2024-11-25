import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class UpdateOrganizationDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(2, 20)
  @Matches(/^[a-zA-Z0-9-]*$/u, {
    message: 'Code can only contain letters, numbers and hyphens',
  })
  @IsOptional()
  code?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  @Matches(/^[\p{L}\p{M}0-9'\- !,&-]+$/u, {
    message:
      'Name can only contain letters, accents, apostrophes, commas, hyphens, space, exclamation points and &',
  })
  @IsOptional()
  name?: string;
}
