import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { GroupsEntity } from './group.entity';
import { EditGroupDTO } from './dto/edit-group.dto';
import { GroupRepository } from './group.repository';
import { AddGroupDTO } from './dto/add-group.dto';
import { UsersService } from 'src/user/users.service';

@Injectable()
export class GroupsService {
  constructor(
    private readonly groupRepo: GroupRepository,
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
  ) {}

  async getOneById(id: number): Promise<GroupsEntity> {
    return await this.groupRepo.getOneById(id);
  }

  async getOneOrFail(id: number): Promise<GroupsEntity> {
    const checkGroup = await this.checkGroup(id);
    if (!checkGroup) {
      throw new NotFoundException();
    } else {
      return await this.getOneById(id);
    }
  }

  async getAll(): Promise<GroupsEntity[]> {
    return await this.groupRepo.getAll();
  }

  async createGroup(group: AddGroupDTO): Promise<AddGroupDTO> {
    return await this.groupRepo.save(group);
  }

  async checkGroup(id: number) {
    const group = await this.getOneOrFail(id);
    if (!group) {
      return null;
    }
    return group;
  }

  // async addUser(idUser: number, idGroup: number) {
  //   const checkGroup = this.checkGroup(idGroup);
  //   if ((await checkGroup) == false) {
  //     throw new NotFoundException();
  //   }
  //   const group = await this.groupRepo.getOneById(idGroup);
  //   return this.userService.addUser(idUser, group);
  // }

  async update(idGroup, group: EditGroupDTO) {
    const checkGroup = await this.checkGroup(idGroup);
    if (!checkGroup) {
      throw new NotFoundException();
    } else {
      return await this.groupRepo.update(idGroup, group);
    }
  }

  async remove(idGroup: number) {
    const checkGroup = await this.checkGroup(idGroup);
    if (!checkGroup) {
      throw new NotFoundException();
    } else {
      const group = this.getOneById(idGroup);
      (await group).isDeleted = (await group).id;
      return this.groupRepo.save(await group);
    }
  }

  async removeUserInGroup(idUser: number, idGroup: number) {
    const checkGroup = await this.checkGroup(idGroup);
    if (!checkGroup) {
      throw new NotFoundException();
    }
    const group = await this.groupRepo.getOneById(idGroup);
    const filteredUser = group.users.filter((res) => res.id != idUser);
    group.users = filteredUser;
    return await this.groupRepo.save(group);
  }
}
