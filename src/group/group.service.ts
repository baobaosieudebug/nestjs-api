import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { GroupsEntity } from './group.entity';
import { EditGroupDTO } from './dto/edit-group.dto';
import { GroupRepository } from './group.repository';
import { AddGroupDTO } from './dto/add-group.dto';
import { UsersService } from 'src/user/users.service';
import { UserRepository } from '../user/user.repository';

@Injectable()
export class GroupsService {
  constructor(
    private readonly groupRepo: GroupRepository,
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
    private readonly userRepo: UserRepository,
  ) {}

  async getOneById(id: number) {
    return await this.groupRepo.getOneById(id);
  }

  async getOneOrFail(id: number) {
    const response = await this.getOneById(id);
    if (!response) {
      throw new NotFoundException();
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

  async checkGroup(id: number) {
    const group = await this.groupRepo.getOneById(id);
    if (!group) {
      return null;
    }
    return group;
  }

  async update(idGroup, dto: EditGroupDTO) {
    const checkGroup = await this.checkGroup(idGroup);
    if (!checkGroup) {
      throw new NotFoundException();
    }
    const existName = this.groupRepo.getByName(dto.nameGroup);
    if (existName) {
      throw new NotFoundException('Name Group must be unique');
    }
    try {
      return await this.groupRepo.update(idGroup, dto);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async remove(idGroup: number) {
    const checkGroup = await this.checkGroup(idGroup);
    if (!checkGroup) {
      throw new NotFoundException();
    }
    try {
      return this.groupRepo.update(idGroup, { isDeleted: idGroup });
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async addUser(idUser: number, idGroup: number) {
    const checkGroup = await this.checkGroup(idGroup);
    if (!checkGroup) {
      throw new NotFoundException();
    }
    const existUser = this.groupRepo.isUserExistInGroup(idUser);
    if (!existUser) {
      throw new BadRequestException('User not exist Group');
    }
    try {
      return this.userService.addUser(idUser, idGroup);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async removeUserInGroup(idUser: number, idGroup: number) {
    const checkGroup = await this.checkGroup(idGroup);
    if (!checkGroup) {
      throw new NotFoundException();
    }
    const existUser = await this.groupRepo.isUserExistInGroup(idUser);
    if (existUser == 0) {
      throw new BadRequestException('User not exist Group');
    }
    try {
      return await this.groupRepo.removeUserInGroup(idUser, idGroup);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async getAllUserByID(id: number) {
    const checkGroup = await this.checkGroup(id);
    if (!checkGroup) {
      throw new NotFoundException();
    }
    const existUser = await this.userRepo.countUserInGroup(id);
    if (existUser == 0) {
      throw new NotFoundException('Group not exist User');
    }
    try {
      return await this.userService.getAllUserByIDGroup(id);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
}
