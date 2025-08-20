import {
  IsEmail,
  IsOptional,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class UpdateUserDto {
  @IsEmail()
  @Length(5, 48)
  @IsOptional()
  email?: string;

  @Length(8, 64)
  @Matches(/^(?=.*\d).{8,}$/, {
    message:
      'Password must be at least 8 characters long and contain at least one number',
  })
  @IsOptional()
  password?: string;

  @IsString()
  @Length(2, 50)
  @Matches(/^[\p{L}\p{M}'-]+$/u, {
    message: 'Name can only contain letters, accents, apostrophes, and hyphens',
  })
  @IsOptional()
  firstName?: string;

  @IsString()
  @Length(2, 50)
  @Matches(/^[\p{L}\p{M}'-]+$/u, {
    message: 'Name can only contain letters, accents, apostrophes, and hyphens',
  })
  @IsOptional()
  lastName?: string;
}
