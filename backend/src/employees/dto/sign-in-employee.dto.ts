import { Exclude, Expose } from 'class-transformer';
import { IsPhoneNumber, IsNotEmpty, IsNumberString } from 'class-validator';

export class SignInEmployeeDto {
  @IsNotEmpty()
  @IsPhoneNumber('PT')
  @Expose()
  phone_number: string;

  @IsNotEmpty()
  @IsNumberString()
  @Expose()
  otp: string;
}
