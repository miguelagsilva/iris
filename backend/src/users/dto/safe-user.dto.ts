import {
  IsEmail,
  IsString,
  Length,
  IsUUID,
  Matches,
  IsNotEmpty,
} from 'class-validator';
import { Expose } from 'class-transformer';

export class SafeUserDto {
  @IsUUID()
  @Expose()
  id: string;

  @IsEmail()
  @IsNotEmpty()
  @Length(5, 48)
  @Expose()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  @Matches(/^[\p{L}\p{M}'-]+$/u, {
    message: 'Name can only contain letters, accents, apostrophes, and hyphens',
  })
  @Expose()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @Length(2, 50)
  @Matches(/^[\p{L}\p{M}'-]+$/u, {
    message: 'Name can only contain letters, accents, apostrophes, and hyphens',
  })
  @Expose()
  lastName: string;

  @IsUUID()
  @Expose()
  organizationId: string;
}
