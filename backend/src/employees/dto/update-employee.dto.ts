import { ApiProperty } from '@nestjs/swagger';
import {
  IsPhoneNumber,
  IsString,
  Length,
  IsUUID,
  Matches,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

export class UpdateEmployeeDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  @Matches(/^[\p{L}\p{M}\p{N}\s'\-,.!&()]+$/u, {
    message:
      'Name can contain letters, numbers, accents, spaces, and common punctuation (apostrophes, hyphens, periods, commas, exclamation points, ampersands, and parentheses)',
  })
  @IsOptional()
  name?: string;

  @ApiProperty()
  @IsUUID()
  @IsOptional()
  organizationId?: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsPhoneNumber('PT')
  @IsOptional()
  phone_number?: string;
}
