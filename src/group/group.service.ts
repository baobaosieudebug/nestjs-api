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
import { UsersService } from 'src/user/users.service';
import { EditGroupDTO } from './dto/edit-group.dto';
import { AddGroupDTO } from './dto/add-group.dto';

@Injectable()
export class GroupsService {
  private readonly logger = new Logger(GroupsService.name);
  constructor(
    private readonly groupRepo: GroupRepository,
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
  ) {}

  async getOneById(id: number) {
    return await this.groupRepo.getOneById(id);
  }

  async getOneOrFail(id: number) {
    const group = await this.getOneById(id);
    if (!group) {
      throw new NotFoundException('Group not found');
    }
    return group;
  }

  async getAll(): Promise<GroupsEntity[]> {
    return await this.groupRepo.getAll();
  }

  async createGroup(dto: AddGroupDTO) {
    try {
      const group = this.groupRepo.create(dto);
      return await this.groupRepo.save(group);
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException();
    }
  }

  async update(id: number, dto: EditGroupDTO) {
    await this.getOneOrFail(id);
    try {
      return await this.groupRepo.update(id, dto);
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException();
    }
  }

  async remove(id: number) {
    await this.getOneOrFail(id);
    try {
      return this.groupRepo.update(id, { isDeleted: id });
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException();
    }
  }

  async addUser(idUser: number, id: number) {
    await this.getOneOrFail(id);
    try {
      return this.userService.addUser(idUser, id);
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException();
    }
  }

  async getAllUserById(id: number) {
    await this.getOneOrFail(id);
    try {
      return await this.userService.getAllUserByIdGroup(id);
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException();
    }
  }
}
