import { OmitType } from '@nestjs/swagger';
import { Organization } from '../organization.entity';

export class CreateOrganizationDto extends OmitType(Organization, [
  'id',
  'createdAt',
  'updatedAt',
  'deletedAt',
  'groups',
  'users',
] as const) {}
