import {
  Injectable,
  HttpStatus,
  HttpException,
  HttpService,
  UnauthorizedException,
  Param,
} from '@nestjs/common';
import { AddUserDTO } from '../dto/add-user.dto';
import * as bcrypt from 'bcrypt';
import axios from 'axios';
import { LoginUserDTO } from '../dto/login-user.dto';
import { TokenUserDTO } from '../dto/token-user.dto';
import { BadRequestException } from '@nestjs/common';
import { AddUsersRO } from 'src/ro/add-user.ro';
import { EditUserDTO } from 'src/dto/edit-user.dto';
import { EditUserRO } from 'src/ro/edit-user.ro';
import { GetUserRO } from 'src/ro/get-user.ro';
import { JoinGroupRO } from 'src/ro/join-group.ro';
import { GetListUserRO } from 'src/ro/get-list-user.ro';
import { GetAllGroupRO } from 'src/ro/get-all-group.ro';
import { UserRepository } from 'src/repo/user.repository';
import { GroupRepository } from 'src/repo/group.repository';
import { getCustomRepository } from 'typeorm';
import { TaskRepository } from 'src/repo/task.respository';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly httpService: HttpService,
  ) {}
  groupRepo = getCustomRepository(GroupRepository);
  taskRepo = getCustomRepository(TaskRepository);

  /*---------------------------------------GET Method--------------------------------------- */
  /**
   * @method Get
   * @param id ||  @param email || @param null
   * @returns information of User
   * @property name & email & groups
   */
  async getOneById(id: number) {
    return await this.userRepo.getById(id);
  }

  async getOneByIdOrFail(id: number) {
    if ((await this.getOneById(id)) == null) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    } else {
      const response = await this.getOneById(id);
      const userRO = new GetUserRO();
      userRO.name = response.name;
      userRO.email = response.email;
      userRO.groups = response.groups;
      userRO.tasks = response.tasks;
      return userRO;
    }
  }

  async getUserByEmail(email: string) {
    return await this.userRepo.getByEmail(email);
  }

  async getUserByEmailOrFail(email) {
    if ((await this.getUserByEmail(email)) == null) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    } else {
      const response = await this.getUserByEmail(email);
      const userRO = new GetUserRO();
      userRO.name = response.name;
      userRO.email = response.email;
      userRO.groups = response.groups;
      return userRO;
    }
  }

  async getAllUser(): Promise<GetListUserRO[]> {
    return await this.userRepo.getAllUser();
  }

  async getAllGroupOfUser(idUser: number) {
    const user = await this.userRepo.getById(idUser);
    if (user === undefined) {
      throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
    } else {
      const response = new GetAllGroupRO();
      response.email = user.email;
      response.name = user.name;
      response.groups = user.groups;
      return response;
    }
  }

  /**
   * @method Get
   * @param access_token
   * @returns data
   */
  async getListUserAndVerifyToken(access_token: TokenUserDTO) {
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

  /*---Task----*/
  async getAllTaskByIdUser(@Param('idUser') idUser: number) {
    return await this.userRepo.getAllTask(idUser);
  }

  /*---------------------------------------POST Method--------------------------------------- */
  /**
   * @method Post
   * @param user
   * @returns token for user
   * @property Bearer Token
   */
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

  async create(user: AddUserDTO): Promise<AddUsersRO> {
    user.password = await bcrypt.hash(user.password, 12);
    await this.userRepo.save(user);
    const userRO = new AddUsersRO();
    userRO.email = user.email;
    userRO.name = user.name;
    return userRO;
  }

  async userJoinGroup(idUser: number, idGroup: number) {
    const group = await this.groupRepo.getById(idGroup);
    const user = await this.userRepo.getById(idUser);
    if (group == undefined) {
      throw new HttpException('Group Not Found', HttpStatus.NOT_FOUND);
    } else {
      if (user == undefined) {
        throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
      } else {
        group.users = [user];
        await this.groupRepo.save(group);
        const groupRO = new JoinGroupRO();
        groupRO.id = group.id;
        groupRO.nameGroup = group.nameGroup;
        return groupRO;
      }
    }
  }

  /*---Task----*/
  async addTask(idUser: number, codeId: number) {
    const newTask = await this.taskRepo.getByCodeId(codeId);
    const user = await this.userRepo.getById(idUser);
    user.tasks.push(newTask);
    await this.userRepo.save(user);
    return new HttpException('Add Task Success', HttpStatus.OK);
  }
  /*---------------------------------------PUT Method--------------------------------------- */
  async update(id: number, user: EditUserDTO): Promise<EditUserRO> {
    user.password = await bcrypt.hash(user.password, 12);
    if ((await this.getOneById(id)) == null) {
      throw new HttpException(
        'User not found in your param',
        HttpStatus.NOT_FOUND,
      );
    } else {
      if (
        (await user.name) == undefined ||
        (await user.email) == undefined ||
        (await user.password) == undefined
      ) {
        throw new HttpException(
          'User not found in your body',
          HttpStatus.NOT_FOUND,
        );
      } else {
        await this.userRepo.update(id, user);
        const userRO = new EditUserRO();
        userRO.email = user.email;
        userRO.name = user.name;
        return userRO;
      }
    }
  }

  /*---------------------------------------DELETE Method--------------------------------------- */
  async destroy(id: number) {
    if ((await this.getOneById(id)) == null) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    } else {
      await this.userRepo.delete(id);
      return new HttpException('Delete User Successfully', HttpStatus.OK);
    }
  }

  async groupJoinByUser(idUser: number, idGroup: number) {
    const group = await this.groupRepo.getById(idGroup);
    const user = await this.userRepo.getById(idUser);
    user.groups = [group];
    await this.userRepo.save(user);
    return user;
  }
}
