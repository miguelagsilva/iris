import { ApiProperty } from '@nestjs/swagger';
import {
  IsPhoneNumber,
  IsString,
  Length,
  Matches,
  IsNotEmpty,
  IsOptional,
  IsUUID,
} from 'class-validator';

export class UpdateEmployeeDto {
  @IsString()
  @Length(2, 50)
  @Matches(/^[\p{L}\p{M}\p{N}\s'\-,.!&()]+$/u, {
    message:
      'Name can contain letters, numbers, accents, spaces, and common punctuation (apostrophes, hyphens, periods, commas, exclamation points, ampersands, and parentheses)',
  })
  @IsOptional()
  name?: string;

  @IsPhoneNumber('PT')
  @IsOptional()
  phone_number?: string;

  @IsUUID(undefined, { each: true })
  @IsOptional()
  groupsIds?: string[];
}
