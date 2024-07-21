import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { Role } from '../roles/roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const handlerRoles = this.reflector.get<Role[]>(ROLES_KEY, context.getHandler());
    const classRoles = this.reflector.get<Role[]>(ROLES_KEY, context.getClass());
    console.log('Handler roles:', handlerRoles);
    console.log('Class roles:', classRoles);

    console.log('Required roles from metadata:', requiredRoles);

    if (!requiredRoles) {
      console.log('No required roles specified, allowing access');
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    console.log('User object:', user);
    console.log('User role:', user.role);

    const hasRole = requiredRoles.some((role) => user.role === role);
    console.log('Has required role:', hasRole);

    return hasRole;
  }
}
