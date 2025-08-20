import { IsEmail, Length, Matches } from 'class-validator';

export class SignInUserDto {
  @IsEmail()
  @Length(5, 48)
  email: string;

  @Length(8, 64)
  @Matches(/^(?=.*\d).{8,}$/, {
    message:
      'Password must be at least 8 characters long and contain at least one number',
  })
  password: string;
}
