import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { AddUserDTO } from './dto/add-user.dto';
import * as bcrypt from 'bcrypt';
import { AddUsersRO } from '../user/ro/add-user.ro';
import { EditUserDTO } from './dto/edit-user.dto';
import { UserRepository } from '../user/user.repository';
import { GroupsEntity } from 'src/group/group.entity';
import { TaskService } from 'src/task/task.service';
import { ProjectEntity } from 'src/project/project.entity';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly taskService: TaskService,
  ) {}

  async getOneById(id: number) {
    return await this.userRepo.getOneById(id);
  }

  async getOneByIdOrFail(id: number) {
    const response = await this.getOneById(id);
    if (!response) {
      throw new NotFoundException();
    }
    return response;
  }

  async getAll() {
    return await this.userRepo.getAll();
  }

  async checkUser(id: number): Promise<boolean> {
    const user = await this.userRepo.getOneById(id);
    if (!user) {
      return false;
    }
    return true;
  }

  async create(user: AddUserDTO): Promise<AddUsersRO> {
    try {
      user.password = await bcrypt.hash(user.password, 12);
      await this.userRepo.create(user);
      return await this.userRepo.save(user);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async addUser(idUser: number, group: GroupsEntity) {
    const checkUser = this.checkUser(idUser);
    if ((await checkUser) == false) {
      throw new NotFoundException();
    }
    const user = await this.userRepo.getOneById(idUser);
    user.groups.push(group);
    return await this.userRepo.save(user);
  }

  async addUserInProject(idUser: number, project: ProjectEntity) {
    const checkUser = this.checkUser(idUser);
    if ((await checkUser) == false) {
      throw new NotFoundException();
    }
    const user = await this.userRepo.getOneById(idUser);
    user.projects.push(project);
    return await this.userRepo.save(user);
  }

  async addTask(id: number, codeIdTask: string) {
    const checkUser = this.checkUser(id);
    if ((await checkUser) == false) {
      throw new NotFoundException();
    }
    const user = await this.userRepo.getOneById(id);
    return this.taskService.addTask(codeIdTask, user);
  }

  async assignTask(id: number, codeIdTask: string) {
    const checkUser = this.checkUser(id);
    if ((await checkUser) == false) {
      throw new NotFoundException();
    }
    const user = await this.userRepo.getOneById(id);
    return this.taskService.assignTask(codeIdTask, user);
  }

  async update(id: number, dto: EditUserDTO) {
    const checkUser = this.checkUser(id);
    if ((await checkUser) == false) {
      throw new NotFoundException();
    }
    try {
      (await dto).password = await bcrypt.hash((await dto).password, 12);
      return await this.userRepo.update(id, dto);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async remove(id: number) {
    const checkUser = this.checkUser(id);
    if ((await checkUser) == false) {
      throw new NotFoundException();
    }
    try {
      const user = this.getOneById(id);
      (await user).isDelete = (await user).id;
      return this.userRepo.save(await user);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async removeTask(idUser: number, codeId: string) {
    const checkUser = this.checkUser(idUser);
    if ((await checkUser) == false) {
      throw new NotFoundException();
    }
    const user = await this.userRepo.getOneById(idUser);
    const filteredTask = user.tasks.filter((res) => res.codeId != codeId);
    user.tasks = filteredTask;
    return await this.userRepo.save(user);
  }
}
