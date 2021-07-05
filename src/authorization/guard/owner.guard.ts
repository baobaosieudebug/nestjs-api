import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from "@nestjs/common";
// import * as jwt from 'jsonwebtoken';
import { Reflector } from '@nestjs/core';
import * as jwt from "jsonwebtoken";

@Injectable()
export class OwnerGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const decoded = await this.validateToken(request.headers.authorization);
    const owners = this.reflector.get<number[]>('owners', context.getHandler());
    if (!owners) {
      return true;
    } else {
      return owners.includes(decoded['email']);
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
