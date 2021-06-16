import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { GroupsEntity } from './group.entity';
import { EditGroupDTO } from './dto/edit-group.dto';
import { GroupRepository } from 'src/group/group.repository';
import { UserRepository } from 'src/user/user.repository';
import { AddGroupDTO } from './dto/add-group.dto';

@Injectable()
export class GroupsService {
  constructor(
    private readonly groupRepo: GroupRepository,
    private readonly userRepo: UserRepository,
  ) {}

  async getOneGroupById(id: number): Promise<GroupsEntity> {
    return await this.groupRepo.getById(id);
  }

  async getOneGroupOrFail(id: number): Promise<GroupsEntity> {
    if ((await this.getOneGroupById(id)) == null) {
      throw new HttpException('Group not found', HttpStatus.NOT_FOUND);
    } else {
      return await this.getOneGroupById(id);
    }
  }

  async getAllGroup(): Promise<GroupsEntity[]> {
    return await this.groupRepo.getAllGroup();
  }

  async getAllUserOfOneGroup(idGroup: number): Promise<GroupsEntity> {
    if ((await this.getOneGroupById(idGroup)) == null) {
      throw new HttpException('Group not found', HttpStatus.NOT_FOUND);
    } else {
      return await this.groupRepo.getById(idGroup);
    }
  }

  async getAllTaskByIdGroup(@Param('idGroup') idGroup: number) {
    return await this.groupRepo.getAllTask(idGroup);
  }

  async createGroup(group: AddGroupDTO): Promise<AddGroupDTO> {
    return await this.groupRepo.save(group);
  }
  async update(idGroup, group: EditGroupDTO) {
    if ((await this.getOneGroupById(idGroup)) == null) {
      throw new NotFoundException('ID Incorrect');
    } else {
      return await this.groupRepo.update(idGroup, group);
    }
  }

  async destroy(idGroup: number) {
    if ((await this.getOneGroupById(idGroup)) == null) {
      throw new NotFoundException('ID Incorrect');
    } else {
      return await this.groupRepo.delete(idGroup);
    }
  }

  async deleteUserInGroup(idUser: number, idGroup: number) {
    const user = await this.userRepo.getById(idUser);
    const group = await this.groupRepo.getById(idGroup);
    if (group == undefined) {
      throw new NotFoundException('Group Not Found');
    } else {
      if (user == undefined) {
        throw new NotFoundException('User Not Found');
      } else {
        const filteredUser = group.users.filter((item) => item.id != idUser);
        group.users = filteredUser;
        await this.groupRepo.save(group);
        return HttpStatus.OK;
      }
    }
  }
}
