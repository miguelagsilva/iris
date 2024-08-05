import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export const ORGANIZATION_KEY = 'organization';
export const Organization = () => SetMetadata(ORGANIZATION_KEY, true);

@Injectable()
export class OrganizationGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiresOrganizationCheck = this.reflector.getAllAndOverride<boolean>(
      ORGANIZATION_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiresOrganizationCheck) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    let requestedOrgId = request.params.id; // Check route params first

    // If not in route params, check body
    if (!requestedOrgId && request.body && request.body.organizationId) {
      requestedOrgId = request.body.organizationId;
    }

    if (!user || !user.organizationId) {
      throw new ForbiddenException('User not associated with an organization');
    }

    if (!requestedOrgId) {
      throw new ForbiddenException('Organization ID not provided');
    }

    if (user.organizationId !== requestedOrgId) {
      throw new ForbiddenException(
        'Access to other organization resources is forbidden',
      );
    }

    return true;
  }
}
