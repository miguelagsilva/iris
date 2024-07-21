import { PickType } from '@nestjs/swagger';
import { User } from '../user.entity';

export class SignUpUserDto extends PickType(User, [
  'firstName',
  'lastName',
  'email',
  'password',
] as const) {}
