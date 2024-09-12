import { Exclude, Expose } from 'class-transformer';
import {
  IsPhoneNumber,
  IsNotEmpty,
  IsNumberString,
} from 'class-validator';

export class RequestOTPEmployeeDto {
  @IsNotEmpty()
  @IsPhoneNumber('PT')
  @Expose()
  phone_number: string;
}
