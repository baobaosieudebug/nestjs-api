import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUser(username: string, password: string) {
    const user = await this.usersService.getOneByIdOrFail(1);

    if (user && user.password === password) {
      const { password, email, ...rest } = user;
      return rest;
    }
    return null;
  }
}
