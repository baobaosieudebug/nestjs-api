import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { LoginUserDTO } from 'src/users/dto/login-user.dto';
import { HttpService } from '@nestjs/common';
import axios from 'axios';
import { UnauthorizedException } from '@nestjs/common';
import { TokenUserDTO } from 'src/users/dto/token-user.dto';
import { Observable } from 'rxjs';
import { AxiosResponse } from 'axios';
import { UsersEntity } from 'src/users/users.entity';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private httpService: HttpService,
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

  async getListUserAndVerifyToken(tokens: TokenUserDTO) {
    const apiUrl = 'http://localhost:5001';
    const authAxios = axios.create({
      baseURL: apiUrl,
      headers: {
        Authorization: `Bearer ${tokens.token}`,
      },
    });

    const result = authAxios.get(`${apiUrl}/users`).catch(() => {
      throw new BadRequestException('Bad Request!');
    });
    return (await result).data;
  }
}
