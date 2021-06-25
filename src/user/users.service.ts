import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { AddUserDTO } from './dto/add-user.dto';
import * as bcrypt from 'bcrypt';
import { EditUserDTO } from './dto/edit-user.dto';
import { UserRepository } from './user.repository';
import { TaskService } from '../task/task.service';
import { ProjectRepository } from '../project/project.repository';
import { GroupRepository } from '../group/group.repository';
import { TaskRepository } from '../task/task.respository';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly taskService: TaskService,
    private readonly projectRepo: ProjectRepository,
    private readonly groupRepo: GroupRepository,
    private readonly taskRepo: TaskRepository,
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

  async checkUser(id: number) {
    const user = await this.userRepo.getOneByIdOrFail(id);
    if (!user) {
      return null;
    }
    return user;
  }

  async checkUserByEmail(email: string) {
    const user = await this.userRepo.getOneByEmail(email);
    if (!user) {
      return null;
    }
    return user;
  }

  async checkDeleted(id: number) {
    const user = this.userRepo.getByIdWithDelete(id);
    if (!user) {
      return null;
    }
    return user;
  }

  async create(user: AddUserDTO) {
    const checkUser = await this.checkUserByEmail(user.email);
    if (checkUser) {
      throw new NotFoundException('Email must be unique');
    }
    try {
      user.password = await bcrypt.hash(user.password, 12);
      const newUser = this.userRepo.create(user);
      return await this.userRepo.save(newUser);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async addUser(idUser: number, idGroup: number) {
    const checkUser = await this.checkUser(idUser);
    if (!checkUser) {
      throw new NotFoundException();
    }
    try {
      const group = await this.groupRepo.getOneById(idGroup);
      await checkUser.groups.push(group);
      await this.userRepo.save(checkUser);
      return checkUser;
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async addUserInProject(idUser: number, idProject: number) {
    const checkUser = await this.checkUser(idUser);
    if (!checkUser) {
      throw new NotFoundException();
    }
    const existUser = await this.userRepo.isUserExistInProject(
      idProject,
      idUser,
    );
    if (existUser) {
      throw new BadRequestException('User exist in Project');
    }
    try {
      const project = await this.projectRepo.getById(idProject);
      await checkUser.projects.push(project);
      await this.userRepo.save(checkUser);
      return checkUser;
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async assignTask(idUser: number, codeTask: string) {
    const checkUser = await this.checkUser(idUser);
    if (!checkUser) {
      throw new NotFoundException();
    }
    try {
      return this.taskService.assignTask(codeTask, idUser);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async update(id: number, dto: EditUserDTO) {
    const checkUser = await this.checkUser(id);
    if (!checkUser) {
      throw new NotFoundException();
    }
    try {
      dto.password = await bcrypt.hash(dto.password, 12);
      return this.userRepo.update(id, dto);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async remove(id: number) {
    const checkUser = await this.checkUser(id);
    if (!checkUser) {
      throw new NotFoundException();
    }
    const existDeleted = this.checkDeleted(id);
    if (!existDeleted) {
      throw new BadRequestException('User Deleted');
    }
    try {
      return await this.userRepo.update(id, { isDeleted: id });
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async removeUserCreateTask(idUser: number, code: string) {
    const checkUser = await this.checkUser(idUser);
    if (!checkUser) {
      throw new NotFoundException();
    }
    try {
      return this.taskService.removeUserCreateTask(idUser, code);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async getAllUserByIDProject(idProject: number) {
    try {
      return await this.userRepo.getAllUserByIDProject(idProject);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async getAllUserByIDGroup(idGroup: number) {
    try {
      return await this.userRepo.getAllUserByIDGroup(idGroup);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
  async getAllAssignTaskByID(id: number) {
    const checkUser = await this.checkUser(id);
    if (!checkUser) {
      throw new NotFoundException();
    }
    const existAssignTask = await this.taskRepo.isExistTaskByAssignUser(id);
    if (existAssignTask == false) {
      throw new NotFoundException('User not assigned Task');
    }
    try {
      return await this.taskService.getAllAssignTaskByIDUser(id);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async getAllCreateTaskByID(id: number) {
    const checkUser = await this.checkUser(id);
    if (!checkUser) {
      throw new NotFoundException();
    }
    const existCreateTask = await this.taskRepo.isExistTaskByCreateUser(id);
    if (existCreateTask == false) {
      throw new NotFoundException('User not created Task');
    }
    try {
      return await this.taskService.getAllCreateTaskByIDUser(id);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
}
