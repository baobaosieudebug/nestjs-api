import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { getCustomRepository } from 'typeorm';
import { GroupsEntity } from './group.entity';
import { EditGroupDTO } from './dto/edit-group.dto';
import { GroupRepository } from 'src/group/group.repository';
import { UserRepository } from 'src/user/repo/user.repository';
import { TaskRepository } from 'src/task/repo/task.respository';

@Injectable()
export class GroupsService {
  constructor(private readonly groupRepo: GroupRepository) {}
  userRepo = getCustomRepository(UserRepository);
  taskRepo = getCustomRepository(TaskRepository);

  /*---------------------------------------GET Method--------------------------------------- */

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

  /*---Task----*/
  async getAllTaskByIdGroup(@Param('idGroup') idGroup: number) {
    return await this.groupRepo.getAllTask(idGroup);
  }

  /*---------------------------------------POST Method--------------------------------------- */
  async createGroup(group: GroupsEntity): Promise<any> {
    return await this.groupRepo.save(group);
  }

  /*---------------------------------------PUT Method--------------------------------------- */

  async update(idGroup, group: EditGroupDTO) {
    if ((await this.getOneGroupById(idGroup)) == null) {
      throw new HttpException('Group not found', HttpStatus.NOT_FOUND);
    } else {
      await this.groupRepo.update(idGroup, group);
      return HttpStatus.OK;
    }
  }

  /*---------------------------------------DELETE Method--------------------------------------- */

  async destroy(idGroup: number) {
    if ((await this.getOneGroupById(idGroup)) == null) {
      throw new HttpException('Group not found', HttpStatus.NOT_FOUND);
    } else {
      await this.groupRepo.delete(idGroup);
      return HttpStatus.OK;
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
