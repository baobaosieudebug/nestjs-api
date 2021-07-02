import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
// import * as jwt from 'jsonwebtoken';
import { Reflector } from '@nestjs/core';

@Injectable()
export class OwnerGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // const request = context.switchToHttp().getRequest();
    // const decoded = await this.validateToken(request.headers.authorization);
    const owners = this.reflector.get<number[]>('owners', context.getHandler());
    if (!owners) {
      return true;
    } else {
      // return owners.includes(decoded['roles']);
      return false;
    }
  }
}
