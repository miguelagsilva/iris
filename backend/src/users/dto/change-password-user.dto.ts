import { IsEmail, Length, Matches } from 'class-validator';

export class ChangePasswordUserDto {
  @IsEmail()
  @Length(5, 48)
  email: string;

  @Length(8, 64)
  @Matches(/^(?=.*\d).{8,}$/, {
    message:
      'Password must be at least 8 characters long and contain at least one number',
  })
  oldPassword: string;

  @Length(8, 64)
  @Matches(/^(?=.*\d).{8,}$/, {
    message:
      'Password must be at least 8 characters long and contain at least one number',
  })
  newPassword: string;
}
