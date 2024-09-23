import { ApiProperty } from '@nestjs/swagger';
import {
  IsPhoneNumber,
  IsString,
  Length,
  IsUUID,
  Matches,
  IsNotEmpty,
} from 'class-validator';

export class CreateEmployeeDto {
  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  @Matches(/^[\p{L}\p{M}\p{N}\s'\-,.!&()]+$/u, {
    message:
      'Name can contain letters, numbers, accents, spaces, and common punctuation (apostrophes, hyphens, periods, commas, exclamation points, ampersands, and parentheses)',
  })
  name: string;

  @IsUUID()
  @IsNotEmpty()
  organizationId: string;

  @IsNotEmpty()
  @IsPhoneNumber('PT')
  phone_number: string;

  @IsUUID(undefined, { each: true })
  @IsNotEmpty()
  groupsIds: string[];
}
