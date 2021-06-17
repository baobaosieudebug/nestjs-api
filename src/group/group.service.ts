import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { GroupsEntity } from './group.entity';
import { EditGroupDTO } from './dto/edit-group.dto';
import { GroupRepository } from '../group/group.repository';
import { UserRepository } from '../user/user.repository';
import { AddGroupDTO } from './dto/add-group.dto';
import { UsersService } from 'src/user/users.service';

@Injectable()
export class GroupsService {
  constructor(
    private readonly groupRepo: GroupRepository,
    private readonly userRepo: UserRepository,
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
  ) {}

  async getOneById(id: number): Promise<GroupsEntity> {
    return await this.groupRepo.getOneById(id);
  }

  async getOneOrFail(id: number): Promise<GroupsEntity> {
    if ((await this.getOneById(id)) == null) {
      throw new NotFoundException('ID Incorrect');
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

  async checkGroup(id: number): Promise<boolean> {
    const group = await this.groupRepo.getOneById(id);
    if (!group) {
      return false;
    }
    return true;
  }

  async addUser(idUser: number, idGroup: number) {
    const checkGroup = this.checkGroup(idGroup);
    if ((await checkGroup) == false) {
      throw new NotFoundException('Project CodeID Incorrect');
    }
    const group = await this.groupRepo.getOneById(idGroup);
    return this.userService.addUser(idUser, group);
  }

  async update(idGroup, group: EditGroupDTO) {
    if ((await this.getOneById(idGroup)) == null) {
      throw new NotFoundException('ID Incorrect');
    } else {
      return await this.groupRepo.update(idGroup, group);
    }
  }

  async remove(idGroup: number) {
    if ((await this.getOneById(idGroup)) == null) {
      throw new NotFoundException('ID Incorrect');
    } else {
      return await this.groupRepo.delete(idGroup);
    }
  }

  async removeUserInGroup(idUser: number, idGroup: number) {
    const user = await this.userRepo.getOneById(idUser);
    const group = await this.groupRepo.getOneById(idGroup);
    if (group == undefined) {
      throw new NotFoundException('Group Not Found');
    } else {
      if (user == undefined) {
        throw new NotFoundException('User Not Found');
      } else {
        const filteredUser = group.users.filter((item) => item.id != idUser);
        group.users = filteredUser;
        return await this.groupRepo.save(group);
      }
    }
  }
}
