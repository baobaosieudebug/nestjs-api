import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { UnauthorizedException } from '@nestjs/common';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }
  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.get<boolean>('isPublic', context.getHandler());

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }

  handleRequest(err, user) {
    if (err || !user) {
      throw err || new UnauthorizedException('You Incorrect Token');
    }
    return user;
  }
}
