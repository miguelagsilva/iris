import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, Length, Matches } from 'class-validator';

export class ChangePasswordUserDto {
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
  oldPassword: string;

  @ApiProperty()
  @Length(8, 64)
  @Matches(/^(?=.*\d).{8,}$/, {
    message:
      'Password must be at least 8 characters long and contain at least one number',
  })
  newPassword: string;
}
