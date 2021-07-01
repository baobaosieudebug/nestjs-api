import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const decoded = await this.validateToken(request.headers.authorization);
    const roles = this.reflector.get<number[]>('roles', context.getHandler());
    const roleControllers = this.reflector.get<string[]>(
      'roles',
      context.getClass(),
    );
    // If public route allow access, else check role permission
    if (!roles) {
      return true;
    } else {
      return roles.includes(decoded['role']);
    }
  }

  async validateToken(auth: string) {
    // check request header
    if (!auth) {
      throw new HttpException(
        'Authorization header is required.',
        HttpStatus.FORBIDDEN,
      );
    }
    const authHeader = auth.split(' ');
    if (authHeader[0] !== 'Bearer') {
      throw new HttpException('Invalid Token', HttpStatus.FORBIDDEN);
    }
    const token = authHeader[1];
    try {
      const decoded = jwt.verify(token, 'SECRET');
      return decoded;
    } catch (err) {
      const message = 'Token error: ' + (err.message || err.name);
      throw new HttpException(message, HttpStatus.FORBIDDEN);
    }
  }
}
// import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
// import { Reflector } from '@nestjs/core';
// import { Role } from './role.enum';
// import { ROLES_KEY } from './role.decorator';
//
// @Injectable()
// export class RolesGuard implements CanActivate {
//   constructor(private reflector: Reflector) {}
//
//   canActivate(context: ExecutionContext): boolean {
//     const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
//       context.getHandler(),
//       context.getClass(),
//     ]);
//     if (!requiredRoles) {
//       return true;
//     }
//     const { user } = context.switchToHttp().getRequest();
//     return requiredRoles.some((role) => user.roles?.includes(role));
//   }
// }
