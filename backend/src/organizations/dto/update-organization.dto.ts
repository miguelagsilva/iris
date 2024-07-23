import { OmitType, PartialType } from '@nestjs/swagger';
import { Organization } from '../organization.entity';

export class UpdateOrganizationDto extends PartialType(
  OmitType(Organization, [
    'id',
    'createdAt',
    'updatedAt',
    'deletedAt',
    'groups',
    'users',
  ] as const),
) {}
