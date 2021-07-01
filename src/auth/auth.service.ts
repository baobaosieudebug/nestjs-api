import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDTO } from '../user/dto/login-user.dto';
import { HttpService } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
// import { UserRepository } from '../user/user.repository';
import { UsersService } from '../user/users.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private httpService: HttpService,
    private userService: UsersService,
  ) {}

  async getToken(user: any) {
    const payload = { email: user.email, name: user.name };
    return {
      token: this.jwtService.sign(payload),
    };
  }

  // async login(user: LoginUserDTO) {
  //   const response = await this.httpService
  //     .post('http://localhost:5001/auth/login', {
  //       email: user.email,
  //       password: user.password,
  //     })
  //     .toPromise();
  //   if (!response) {
  //     throw new BadRequestException(
  //       'Bad Request ! Check My Email And Password !',
  //     );
  //   } else {
  //     return response.data;
  //   }
  // }

  async login(data: LoginUserDTO) {
    // find username exist in db
    const user = await this.userService.getOneById(1);
    // if ((await bcrypt.compare(data.password, user.password)) == false) {
    //   throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
    // }
    const token = this.getUserToken(user);
    return {
      id: user.id,
      email: user.email,
      roles: user.roles,
      token,
    };
  }

  private getUserToken(user) {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };
    const token = jwt.sign(payload, 'SECRET', { expiresIn: 3000 });
    return token;
  }

  async verifyToken(user: LoginUserDTO) {
    const response = await this.httpService
      .post('http://localhost:5001/auth/login', {
        email: user.email,
        password: user.password,
      })
      .toPromise();
    if (response.data == 400) {
      throw new BadRequestException(
        'Bad Request ! Check My Email And Password !',
      );
    } else {
      const headersRequest = {
        'Content-Type': 'application/json', // afaik this one is not needed
        Authorization: `Bearer ${response.data}`,
      };
      const listUser = await this.httpService
        .get('http://localhost:5001/users', { headers: headersRequest })
        .toPromise();
      return listUser.data;
    }
  }
}
