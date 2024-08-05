import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length, Matches } from 'class-validator';

export class CreateUserDto {
  @ApiProperty()
  @IsEmail()
  @Length(5, 48)
  email: string;

  @ApiProperty()
  @Length(8, 64)
  @Matches(/^(?=.*\d).{8,}$/, {
    message:
      'Password must be at least 8 characters long and contain at least one number',
  })
  password: string;

  @ApiProperty()
  @IsString()
  @Length(2, 50)
  @Matches(/^[\p{L}\p{M}'-]+$/u, {
    message: 'Name can only contain letters, accents, apostrophes, and hyphens',
  })
  firstName: string;

  @ApiProperty()
  @IsString()
  @Length(2, 50)
  @Matches(/^[\p{L}\p{M}'-]+$/u, {
    message: 'Name can only contain letters, accents, apostrophes, and hyphens',
  })
  lastName: string;
}
