import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { GroupsEntity } from './group.entity';
import { getRepository } from 'typeorm';
import { UsersEntity } from 'src/users/users.entity';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(GroupsEntity)
    private readonly groupsRepository: Repository<GroupsEntity>,
  ) {}

  async getOneGroupById(id: number): Promise<GroupsEntity> {
    return await this.groupsRepository.findOne(id);
  }
  async getOneGroupOrFail(id: number): Promise<GroupsEntity> {
    if ((await this.getOneGroupById(id)) == null) {
      throw new HttpException('Group not found', HttpStatus.NOT_FOUND);
    } else {
      return await this.getOneGroupById(id);
    }
  }
  async showAll(): Promise<GroupsEntity[]> {
    return await this.groupsRepository.find();
  }
  async createGroup(group: GroupsEntity): Promise<any> {
    return await this.groupsRepository.save(group);
  }
  async getAllUserOfOneGroup(idGroup: number): Promise<GroupsEntity> {
    if ((await this.getOneGroupById(idGroup)) == null) {
      throw new HttpException('Group not found', HttpStatus.NOT_FOUND);
    } else {
      return await this.groupsRepository.findOne(idGroup, {
        relations: ['users'],
      });
    }
  }
  async update(idGroup, group: GroupsEntity): Promise<UpdateResult> {
    if ((await this.getOneGroupById(idGroup)) == null) {
      throw new HttpException('Group not found', HttpStatus.NOT_FOUND);
    } else {
      return await this.groupsRepository.update(idGroup, group);
    }
  }
  async destroy(idGroup: number): Promise<DeleteResult> {
    if ((await this.getOneGroupById(idGroup)) == null) {
      throw new HttpException('Group not found', HttpStatus.NOT_FOUND);
    } else {
      return await this.groupsRepository.delete(idGroup);
    }
  }
  async deleteUserInGroup(idUser: number, idGroup: number) {
    const usersRepository = getRepository(UsersEntity);
    const user = await usersRepository.findOne({ id: idUser });
    const group = await this.groupsRepository.findOne(idGroup, {
      relations: ['users'],
    });
    if (group == undefined) {
      throw new HttpException('Group Not Found', HttpStatus.NOT_FOUND);
    } else {
      if (user == undefined) {
        throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
      } else {
        const filteredUser = group.users.filter((item) => item.id != idUser);
        group.users = filteredUser;
        await this.groupsRepository.save(group);
        throw new HttpException('Delete User Successfully', HttpStatus.OK);
      }
    }
  }
}
