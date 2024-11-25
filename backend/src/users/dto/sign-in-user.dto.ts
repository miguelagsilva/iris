import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, Length, Matches } from 'class-validator';

export class SignInUserDto {
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
}
