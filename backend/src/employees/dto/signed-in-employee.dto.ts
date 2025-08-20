import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  IsString,
  IsUUID,
  IsPhoneNumber,
  IsNotEmpty,
  Length,
  Matches,
} from 'class-validator';
import { SafeOrganizationDto } from 'src/organizations/dto/safe-organization.dto';

export class SignedInEmployeeDto {
  @IsUUID()
  @Expose()
  id: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  @Matches(/^[\p{L}\p{M}\p{N}\s'\-,.!&()]+$/u, {
    message:
      'Name can contain letters, numbers, accents, spaces, and common punctuation (apostrophes, hyphens, periods, commas, exclamation points, ampersands, and parentheses)',
  })
  @Expose()
  name: string;

  @IsNotEmpty()
  @IsPhoneNumber('PT')
  @Expose()
  phone_number: string;

  @Expose()
  organization: SafeOrganizationDto;
}
