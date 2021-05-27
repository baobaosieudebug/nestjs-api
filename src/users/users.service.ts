import {
  Injectable,
  HttpStatus,
  HttpException,
  HttpService,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { UsersEntity } from './users.entity';
import { GroupsEntity } from '../group/group.entity';
import { getRepository } from 'typeorm';
import { AddUserDTO } from './dto/add-user.dto';
import { UsersRO } from './ro/users.ro';
import * as bcrypt from 'bcrypt';
import { AxiosResponse } from 'axios';
import { Observable } from 'rxjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
    private httpService: HttpService,
  ) {}

  async getApi(): Promise<Observable<AxiosResponse<any>>> {
    const response = await this.httpService
      // .get('https://api.spacexdata.com/v4/launches/latest')
      .get('http://localhost:5001/users')
      .toPromise();
    return response.data;
  }
  async showAll(): Promise<UsersRO[]> {
    return await this.usersRepository.find();
  }

  async getAllGroup(idUser: number) {
    const user: UsersRO = await this.usersRepository.findOne(idUser, {
      relations: ['groups'],
    });
    if (user === undefined) {
      throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
    } else {
      return user;
    }
  }
  async create(user: AddUserDTO) {
    const hashPassword = await bcrypt.hash(user.password, 12);
    const newUser = new UsersEntity();
    newUser.name = user.name;
    newUser.email = user.email;
    newUser.password = hashPassword;
    newUser.isAdmin = user.isAdmin;
    if (
      newUser.name == undefined ||
      newUser.email == undefined ||
      newUser.password == undefined
    ) {
      throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
    } else {
      return this.usersRepository.save(newUser);
    }
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
