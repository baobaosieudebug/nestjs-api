import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { GroupsEntity } from './group.entity';
import { GroupRepository } from './group.repository';
import { UsersService } from 'src/user/users.service';
import { EditGroupDTO } from './dto/edit-group.dto';
import { AddGroupDTO } from './dto/add-group.dto';

@Injectable()
export class GroupsService {
  constructor(
    private readonly groupRepo: GroupRepository,
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
  ) {}

  async getOneById(id: number) {
    return await this.groupRepo.getOneById(id);
  }

  async getOneOrFail(id: number) {
    const response = await this.getOneById(id);
    if (!response) {
      throw new NotFoundException('Group not found');
    }
    return response;
  }

  async getAll(): Promise<GroupsEntity[]> {
    return await this.groupRepo.getAll();
  }

  async createGroup(dto: AddGroupDTO) {
    try {
      const group = this.groupRepo.create(dto);
      return await this.groupRepo.save(group);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async update(id: number, dto: EditGroupDTO) {
    const checkGroup = await this.getOneOrFail(id);
    if (checkGroup) {
      try {
        return await this.groupRepo.update(id, dto);
      } catch (e) {
        throw new InternalServerErrorException();
      }
    }
  }

  async remove(id: number) {
    const checkGroup = await this.getOneOrFail(id);
    if (checkGroup) {
      try {
        return this.groupRepo.update(id, { isDeleted: id });
      } catch (e) {
        throw new InternalServerErrorException();
      }
    }
  }

  async addUser(idUser: number, id: number) {
    const checkGroup = await this.getOneOrFail(id);
    if (checkGroup) {
      try {
        return this.userService.addUser(idUser, id);
      } catch (e) {
        throw new InternalServerErrorException();
      }
    }
  }

  async getAllUserByID(id: number) {
    const checkGroup = await this.getOneOrFail(id);
    if (checkGroup) {
      try {
        return await this.userService.getAllUserByIDGroup(id);
      } catch (e) {
        throw new InternalServerErrorException();
      }
    }
  }
}
