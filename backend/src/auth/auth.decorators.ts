import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const REQUIRE_ORGANIZATION_MANAGER_KEY = 'requireOrganizationManager';
export const RequireOrganizationManager = () => SetMetadata(REQUIRE_ORGANIZATION_MANAGER_KEY, true);
