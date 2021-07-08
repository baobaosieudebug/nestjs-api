import {
  BadRequestException,
  Injectable,
  NotFoundException,
  HttpService,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { RegisterUserDTO } from '../user/dto/register-user.dto';
import { LoginUserDTO } from '../user/dto/login-user.dto';
import { UsersService } from '../user/users.service';
import { UserRepository } from '../user/user.repository';
import { RandomString } from '../common/utils/random-string';
import { UsersEntity } from '../user/users.entity';
import { UserRO } from '../user/ro/user.ro';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private readonly jwtService: JwtService,
    private readonly httpService: HttpService,
    private readonly userService: UsersService,
    private readonly userRepo: UserRepository,
  ) {}

  async isExistUser(email: string, username: string) {
    const isExistEmail = await this.userRepo.isExistEmail(email);
    const isExistUsername = await this.userRepo.isExistUsername(username);
    if (isExistEmail) {
      throw new BadRequestException('email must be unique');
    }
    if (isExistUsername) {
      throw new BadRequestException('username must be unique');
    }
  }

  async createCode(): Promise<string> {
    let code = '';
    let found = true;
    while (found) {
      code = RandomString(10);
      const existCode = await this.userRepo.isExistCode(code);
      if (!existCode) {
        found = false;
      }
    }
    return code;
  }

  mappingUserRO(user: UsersEntity): UserRO {
    const response = new UserRO();
    response.email = user.email;
    response.username = user.username;
    return response;
  }

  async register(user: RegisterUserDTO) {
    await this.isExistUser(user.email, user.username);
    try {
      user.password = await bcrypt.hash(user.password, 12);
      const newUser = this.userRepo.create(user);
      newUser.code = await this.createCode();
      await this.userRepo.save(newUser);
      return this.mappingUserRO(newUser);
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  async login(data: LoginUserDTO) {
    const user = await this.userService.getOneByEmailOrFail(data.email);
    if (!(await bcrypt.compare(data.password, user.password))) {
      throw new NotFoundException('User wrong password');
    }
    const token = this.getUserToken(user);
    return {
      id: user.id,
      email: user.email,
      roles: user.roles,
      organizationCode: user.organization,
      token,
    };
  }

  getUserToken(user) {
    const payload = {
      id: user.id,
      email: user.email,
      roles: user.roles,
      organizationCode: user.organization,
    };
    const token = jwt.sign(payload, 'SECRET', { expiresIn: 3000 });
    return token;
  }
}
