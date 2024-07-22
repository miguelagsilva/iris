import { OmitType } from '@nestjs/swagger';
import { User } from '../user.entity';

export class CreateUserDto extends OmitType(User, [
  'id',
  'role',
  'createdAt',
  'updatedAt',
  'deletedAt',
  'organization',
  'toSafeUser',
] as const) {}
