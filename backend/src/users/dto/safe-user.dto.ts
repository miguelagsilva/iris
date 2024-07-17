import { OmitType } from '@nestjs/swagger';
import { User } from '../user.entity';

export class SafeUserDto extends OmitType(User, [
  'createdAt',
  'updatedAt',
  'password',
  'deletedAt',
] as const) {}
