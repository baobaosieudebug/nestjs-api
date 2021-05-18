import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { UsersEntity } from './users.entity';
import { GroupsEntity } from '../group/group.entity';
import { getRepository } from 'typeorm';
import { validate } from 'class-validator';
import { UsersDTO } from './interfaces/users.dto';
import { UsersRO } from './interfaces/users.ro';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
  ) {}

  async showAll(): Promise<UsersRO[]> {
    return await this.usersRepository.find();
  }

  async getAllGroup(idUser: number): Promise<UsersRO> {
    return await this.usersRepository.findOne(idUser, {
      relations: ['groups'],
    });
  }
  async create(user: UsersDTO): Promise<any> {
    const newUser = new UsersEntity();
    newUser.name = user.name;
    newUser.email = user.email;
    newUser.password = user.password;
    validate(newUser).then((errors) => {
      // errors is an array of validation errors
      if (errors.length > 0) {
        throw new HttpException('Group Not Found', HttpStatus.NOT_FOUND);
      } else {
        return this.usersRepository.save(newUser);
      }
    });
  }

  async update(id: number, user: UsersDTO) {
    if ((await this.getOneById(id)) == null) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    } else {
      if (
        (await user.name) == undefined ||
        (await user.email) == undefined ||
        (await user.password) == undefined
      ) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
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

  async getOneById(id: number): Promise<UsersRO> {
    return await this.usersRepository.findOne(id, {
      relations: ['groups'],
    });
  }
  async getOneByIdOrFail(id: number): Promise<UsersRO> {
    if ((await this.getOneById(id)) == null) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    } else {
      return await this.getOneById(id);
    }
  }
}
