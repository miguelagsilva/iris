import { PickType } from '@nestjs/swagger';
import { User } from '../user.entity';

export class SignInUserDto extends PickType(User, [
  'email',
  'password',
] as const) {}
