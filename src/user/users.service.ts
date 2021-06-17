import {
  Injectable,
  HttpService,
  UnauthorizedException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { AddUserDTO } from './dto/add-user.dto';
import * as bcrypt from 'bcrypt';
import axios from 'axios';
import { LoginUserDTO } from './dto/login-user.dto';
import { TokenUserDTO } from './dto/token-user.dto';
import { BadRequestException } from '@nestjs/common';
import { AddUsersRO } from '../user/ro/add-user.ro';
import { EditUserDTO } from './dto/edit-user.dto';
import { UserRepository } from '../user/user.repository';
import { GroupsEntity } from 'src/group/group.entity';
import { TaskService } from 'src/task/task.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly httpService: HttpService,
    private readonly taskService: TaskService,
  ) {}

  async getOneById(id: number) {
    return await this.userRepo.getOneById(id);
  }

  async getOneByIdOrFail(id: number) {
    const response = await this.getOneById(id);
    if (!response) {
      throw new NotFoundException('ID Incorrect');
    }
    return response;
  }

  async getAll() {
    return await this.userRepo.getAll();
  }

  async verifyToken(access_token: TokenUserDTO) {
    const apiUrl = 'http://localhost:5001';
    const authAxios = axios.create({
      baseURL: apiUrl,
      headers: {
        Authorization: `Bearer ${access_token.token}`,
      },
    });
    const result = authAxios.get(`${apiUrl}/users`);
    if (!authAxios) {
      throw new UnauthorizedException('Unauthorized!');
    } else {
      if (!result) {
        throw new BadRequestException('Bad Request');
      } else {
        return (await result).data;
      }
    }
  }

  async loginApi(user: LoginUserDTO) {
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

  async checkUser(id: number): Promise<boolean> {
    const user = await this.userRepo.getOneById(id);
    if (!user) {
      return false;
    }
    return true;
  }

  async create(user: AddUserDTO): Promise<AddUsersRO> {
    try {
      user.password = await bcrypt.hash(user.password, 12);
      await this.userRepo.create(user);
      return await this.userRepo.save(user);
    } catch (e) {
      throw new InternalServerErrorException('Sorry, Server is being problem');
    }
  }

  async addUser(idUser: number, group: GroupsEntity) {
    const checkUser = this.checkUser(idUser);
    if ((await checkUser) == false) {
      throw new NotFoundException();
    }
    const user = await this.userRepo.getOneById(idUser);
    user.groups.push(group);
    return await this.userRepo.save(user);
  }

  async addTask(id: number, codeIdTask: string) {
    const checkUser = this.checkUser(id);
    if ((await checkUser) == false) {
      throw new NotFoundException();
    }
    const user = await this.userRepo.getOneById(id);
    return this.taskService.addTask(codeIdTask, user);
  }

  async update(id: number, dto: EditUserDTO) {
    const checkUser = this.checkUser(id);
    if ((await checkUser) == false) {
      throw new NotFoundException();
    }
    try {
      (await dto).password = await bcrypt.hash((await dto).password, 12);
      return await this.userRepo.update(id, dto);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async remove(id: number) {
    const checkUser = this.checkUser(id);
    if ((await checkUser) == false) {
      throw new NotFoundException();
    }
    try {
      const user = this.getOneById(id);
      (await user).isDelete = (await user).id;
      return this.userRepo.save(await user);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
}
