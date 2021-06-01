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
import { AddUserRO } from '../ro/users.ro';
import * as bcrypt from 'bcrypt';
import axios, { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { LoginUserDTO } from '../dto/login-user.dto';
import { TokenUserDTO } from '../dto/token-user.dto';
import { BadRequestException } from '@nestjs/common';
import { CaslAbilityFactory } from 'src/article/casl/casl-ability.factory';
import { ArticleEntity } from 'src/article/article.entity';
import { Action } from 'src/article/action/action.enum';
import { AddUsersRO } from 'src/dto/add-user.ro';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
    private httpService: HttpService,
    private caslAbilityFactory: CaslAbilityFactory,
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

  async showAll(): Promise<AddUserRO[]> {
    return await this.usersRepository.find();
  }

  async getAllGroup(idUser: number) {
    const user: AddUserRO = await this.usersRepository.findOne(idUser, {
      relations: ['groups'],
    });
    if (user === undefined) {
      throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
    } else {
      return user;
    }
  }
  async create(user: AddUserDTO): Promise<AddUserRO> {
    user.password = await bcrypt.hash(user.password, 12);
    await this.usersRepository.create(user);
    const userRO = new AddUserRO();
    userRO.email = user.email;
    userRO.name = user.name;
    return userRO;
  }

  async update(id: number, user: AddUserDTO) {
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
        await this.usersRepository.update(id, user);
        const myUser = await this.usersRepository.findOne(id);
        return myUser;
      }
    }
  }

  async userJoinGroup(idUser: number, idGroup: number) {
    const groupRepository = getRepository(GroupsEntity);
    const group: GroupsEntity = await groupRepository.findOne({ id: idGroup });
    const user = await this.usersRepository.findOne({ id: idUser });
    if (group == undefined) {
      throw new HttpException('Group Not Found', HttpStatus.NOT_FOUND);
    } else {
      if (user == undefined) {
        throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
      } else {
        group.users = [user];
        await groupRepository.save(group);
        return group;
      }
    }
  }

  async groupJoinByUser(idUser: number, idGroup: number) {
    const groupRepository = getRepository(GroupsEntity);
    const group: GroupsEntity = await groupRepository.findOne({ id: idGroup });
    const user = await this.usersRepository.findOne({ id: idUser });
    user.groups = [group];
    await this.usersRepository.save(user);
    return user;
  }

  async destroy(id: number): Promise<DeleteResult> {
    if ((await this.getOneById(id)) == null) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    } else {
      return await this.usersRepository.delete(id);
    }
  }

  async getOneById(id: number) {
    return await this.usersRepository.findOne(id, {
      relations: ['groups'],
    });
  }

  async getOneByIdOrFail(id: number) {
    if ((await this.getOneById(id)) == null) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    } else {
      return await this.getOneById(id);
    }
  }

  async getAddressByIdUser(id: number) {
    return await this.usersRepository.findOne(id, {
      relations: ['addresses'],
    });
  }

  async getUserByEmail(email: string) {
    return await this.usersRepository.findOne({ email: email });
  }
}
