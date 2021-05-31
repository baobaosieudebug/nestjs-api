import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async getToken(user: any) {
    const payload = { email: user.email, name: user.name };
    return {
      token: this.jwtService.sign(payload),
    };
  }

  async validateUser(email: string, password: string) {
    const user = await this.usersService.getUserByEmail(email);
    if ((await bcrypt.compare(password, user.password)) == true) {
      return {
        email: user.email,
        name: user.name,
        token: await this.getToken(user),
      };
    } else {
      throw new BadRequestException('Wrong PassWord');
    }
  }
}
