import { createParamDecorator, ExecutionContext, ForbiddenException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

export const Payload = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const auth: string = request.headers.authorization;
  if (!auth) {
    throw new ForbiddenException('Authorization header not null');
  }
  const authHeader = auth.split(' ');
  if (authHeader[0] !== 'Bearer') {
    throw new ForbiddenException('Invalid token');
  }
  const token = authHeader[1];
  try {
    jwt.verify(token, 'SECRET');
    const payload = jwt.decode(token);
    return payload;
  } catch (err) {
    throw new ForbiddenException('FORBIDDEN');
  }
});
