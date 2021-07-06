import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const decoded = await this.validateToken(request.headers.authorization);
    const roles = this.reflector.get<number[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    } else {
      return roles.includes(decoded['roles']);
    }
  }

  async validateToken(auth: string) {
    if (!auth) {
      throw new ForbiddenException('Authorization header not null');
    }
    const authHeader = auth.split(' ');
    if (authHeader[0] !== 'Bearer') {
      throw new ForbiddenException('Invalid token');
    }
    const token = authHeader[1];
    try {
      const decoded = jwt.verify(token, 'SECRET');
      return decoded;
    } catch (err) {
      throw new ForbiddenException('FORBIDDEN');
    }
  }
}
