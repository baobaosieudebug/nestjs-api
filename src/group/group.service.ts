import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { GroupsEntity } from './group.entity';
import { GroupRepository } from './group.repository';
import { UserService } from 'src/user/user.service';
import { EditGroupDTO } from './dto/edit-group.dto';
import { AddGroupDTO } from './dto/add-group.dto';
import { GetGroupRO } from './ro/get-group.ro';
import { HandleGroupRO } from './ro/handle-group.ro';

@Injectable()
export class GroupsService {
  private readonly logger = new Logger(GroupsService.name);
  constructor(
    private readonly repo: GroupRepository,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  async getOneById(id: number) {
    return await this.repo.getOneById(id);
  }

  async getOneOrFail(id: number) {
    const group = await this.getOneById(id);
    if (!group) {
      throw new NotFoundException('Group not found');
    }
    return group;
  }

  async getAll(): Promise<GetGroupRO[]> {
    const oldArray = await this.repo.getAll();
    const newArray: GetGroupRO[] = [];
    for (let i = 0; i < oldArray.length; i++) {
      const groupRO = await this.getGroupResponse(oldArray[i]);
      newArray.push(groupRO);
    }
    return newArray;
  }

  async getGroupResponse(group: GroupsEntity): Promise<GetGroupRO> {
    const response = new GetGroupRO();
    response.nameGroup = group.nameGroup;
    return response;
  }

  async handleGroupResponse(group: GroupsEntity): Promise<HandleGroupRO> {
    const response = new HandleGroupRO();
    response.nameGroup = group.nameGroup;
    return response;
  }

  async createGroup(dto: AddGroupDTO): Promise<HandleGroupRO> {
    try {
      const group = this.repo.create(dto);
      await this.repo.save(group);
      return this.handleGroupResponse(group);
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException();
    }
  }

  async edit(id: number, dto: EditGroupDTO): Promise<HandleGroupRO> {
    const old = await this.getOneOrFail(id);
    try {
      const group = await this.repo.merge(old, dto);
      await this.repo.update(id, group);
      return this.handleGroupResponse(group);
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException();
    }
  }

  async delete(id: number): Promise<HandleGroupRO> {
    const group = await this.getOneOrFail(id);
    try {
      group.isDeleted = group.id;
      await this.repo.update(id, group);
      return this.handleGroupResponse(group);
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException();
    }
  }

  // async addUser(idUser: number, id: number): Promise<UserRO> {
  //   await this.getOneOrFail(id);
  //   try {
  //     return this.userService.addUser(idUser, id);
  //   } catch (e) {
  //     this.logger.error(e);
  //     throw new InternalServerErrorException();
  //   }
  // }

  // async getAllUserById(id: number): Promise<GetUserRO[]> {
  //   await this.getOneOrFail(id);
  //   try {
  //     return await this.userService.getAllUserByIdGroup(id);
  //   } catch (e) {
  //     this.logger.error(e);
  //     throw new InternalServerErrorException();
  //   }
  // }
}
