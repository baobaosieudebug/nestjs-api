import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDTO } from '../user/dto/login-user.dto';
import { HttpService } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private httpService: HttpService,
  ) {}

  async getToken(user: any) {
    const payload = { email: user.email, name: user.name };
    return {
      token: this.jwtService.sign(payload),
    };
  }

  async login(user: LoginUserDTO) {
    const response = await this.httpService
      .post('http://localhost:5001/auth/login', {
        email: user.email,
        password: user.password,
      })
      .toPromise();
    if (!response) {
      throw new BadRequestException(
        'Bad Request ! Check My Email And Password !',
      );
    } else {
      return response.data;
    }
  }

  async getListUserAndVerifyToken(user: LoginUserDTO) {
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
