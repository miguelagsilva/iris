import { OmitType, PartialType } from '@nestjs/swagger';
import { Organization } from '../organization.entity';

export class SafeOrganizationDto extends PartialType(
  OmitType(Organization, ['createdAt', 'updatedAt', 'deletedAt'] as const),
) {
  static fromOrganization(organization: Organization): SafeOrganizationDto {
    const { createdAt, updatedAt, deletedAt, ...safeOrganization } =
      organization;
    return safeOrganization as SafeOrganizationDto;
  }
}
