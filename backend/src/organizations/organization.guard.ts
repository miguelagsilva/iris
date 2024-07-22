import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { REQUIRE_ORGANIZATION_MANAGER_KEY } from '../auth/auth.decorators';

@Injectable()
export class OrganizationGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requireOrganizationManager =
      this.reflector.getAllAndOverride<boolean>(
        REQUIRE_ORGANIZATION_MANAGER_KEY,
        [context.getHandler(), context.getClass()],
      );

    if (!requireOrganizationManager) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    let organizationId = request.params.organizationId;
    if (!organizationId) {
      organizationId = request.params.id;
    }

    return user.organization?.id === organizationId;
  }
}
