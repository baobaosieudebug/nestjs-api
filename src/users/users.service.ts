import {
  Injectable,
  HttpStatus,
  HttpException,
  HttpService,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { UsersEntity } from './users.entity';
import { GroupsEntity } from '../group/group.entity';
import { getRepository } from 'typeorm';
import { AddUserDTO } from '../dto/add-user.dto';
import * as bcrypt from 'bcrypt';
import axios, { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { LoginUserDTO } from '../dto/login-user.dto';
import { TokenUserDTO } from '../dto/token-user.dto';
import { BadRequestException } from '@nestjs/common';
import { CaslAbilityFactory } from 'src/article/casl/casl-ability.factory';
import { ArticleEntity } from 'src/article/article.entity';
import { Action } from 'src/article/action/action.enum';
import { AddUsersRO } from 'src/ro/add-user.ro';
import { EditUserDTO } from 'src/dto/edit-user.dto';
import { EditUserRO } from 'src/ro/edit-user.ro';
import { GetUserRO } from 'src/ro/get-user.ro';
import { JoinGroupRO } from 'src/ro/join-group.ro';
import { GetListUserRO } from 'src/ro/get-list-user.ro';
import { GetAllGroupRO } from 'src/ro/get-all-group.ro';
import { UserRepository } from 'src/repo/user.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly httpService: HttpService,
  ) {}

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

    // const getApi = await this.httpService
    //   // .get('https://api.spacexdata.com/v4/launches/latest')
    //   .get('http://localhost:5001/users')
    //   .toPromise();
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

  // async showAll(): Promise<GetListUserRO[]> {
  //   return await this.usersRepository.find();
  // }

  // async getAllGroup(idUser: number) {
  //   const user = await this.usersRepository.findOne(idUser, {
  //     relations: ['groups'],
  //   });
  //   if (user === undefined) {
  //     throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
  //   } else {
  //     const response = new GetAllGroupRO();
  //     response.email = user.email;
  //     response.name = user.name;
  //     response.groups = user.groups;
  //     return response;
  //   }
  // }
  // async create(user: AddUserDTO): Promise<AddUsersRO> {
  //   user.password = await bcrypt.hash(user.password, 12);
  //   await this.usersRepository.save(user);
  //   const userRO = new AddUsersRO();
  //   userRO.email = user.email;
  //   userRO.name = user.name;
  //   return userRO;
  // }

  // async update(id: number, user: EditUserDTO): Promise<EditUserRO> {
  //   user.password = await bcrypt.hash(user.password, 12);
  //   if ((await this.getOneById(id)) == null) {
  //     throw new HttpException(
  //       'User not found in your param',
  //       HttpStatus.NOT_FOUND,
  //     );
  //   } else {
  //     if (
  //       (await user.name) == undefined ||
  //       (await user.email) == undefined ||
  //       (await user.password) == undefined
  //     ) {
  //       throw new HttpException(
  //         'User not found in your body',
  //         HttpStatus.NOT_FOUND,
  //       );
  //     } else {
  //       await this.usersRepository.update(id, user);
  //       const userRO = new EditUserRO();
  //       userRO.email = user.email;
  //       userRO.name = user.name;
  //       return userRO;
  //     }
  //   }
  // }

  // async userJoinGroup(idUser: number, idGroup: number) {
  //   const groupRepository = getRepository(GroupsEntity);
  //   const group: GroupsEntity = await groupRepository.findOne({ id: idGroup });
  //   const user = await this.usersRepository.findOne({ id: idUser });
  //   if (group == undefined) {
  //     throw new HttpException('Group Not Found', HttpStatus.NOT_FOUND);
  //   } else {
  //     if (user == undefined) {
  //       throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
  //     } else {
  //       group.users = [user];
  //       await groupRepository.save(group);
  //       const groupRO = new JoinGroupRO();
  //       groupRO.id = group.id;
  //       groupRO.nameGroup = group.nameGroup;
  //       return groupRO;
  //     }
  //   }
  // }

  // async groupJoinByUser(idUser: number, idGroup: number) {
  //   const groupRepository = getRepository(GroupsEntity);
  //   const group: GroupsEntity = await groupRepository.findOne({ id: idGroup });
  //   const user = await this.usersRepository.findOne({ id: idUser });
  //   user.groups = [group];
  //   await this.usersRepository.save(user);
  //   return user;
  // }

  // async destroy(id: number) {
  //   if ((await this.getOneById(id)) == null) {
  //     throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  //   } else {
  //     await this.usersRepository.delete(id);
  //     return HttpStatus.OK;
  //   }
  // }

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
      return userRO;
    }
  }

  // async getAddressByIdUser(id: number) {
  //   return await this.usersRepository.findOne(id, {
  //     relations: ['addresses'],
  //   });
  // }

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
}
