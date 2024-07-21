import { SetMetadata } from '@nestjs/common';
import { Role } from '../roles/roles.enum';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => {
  console.log('Setting roles:', roles);
  return SetMetadata(ROLES_KEY, roles);
};
