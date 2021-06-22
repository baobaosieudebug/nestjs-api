import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { AddUserDTO } from './dto/add-user.dto';
import * as bcrypt from 'bcrypt';
import { AddUsersRO } from './ro/add-user.ro';
import { EditUserDTO } from './dto/edit-user.dto';
import { UserRepository } from './user.repository';
import { GroupsEntity } from 'src/group/group.entity';
import { TaskService } from 'src/task/task.service';
import { ProjectRepository } from '../project/project.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly taskService: TaskService,
    private readonly projectRepo: ProjectRepository,
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
    const user = await this.userRepo.getOneById(id);
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

  async create(user: AddUserDTO): Promise<AddUsersRO> {
    const checkUser = await this.checkUserByEmail(user.email);
    if (checkUser) {
      throw new HttpException('Email must be unique', HttpStatus.NOT_FOUND);
    }
    try {
      user.password = await bcrypt.hash(user.password, 12);
      const newUser = this.userRepo.create(user);
      return await this.userRepo.save(newUser);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async addUser(id: number, group: GroupsEntity) {
    const checkUser = await this.checkUser(id);
    if (!checkUser) {
      throw new NotFoundException();
    }
    try {
      checkUser.groups.push(group);
      return await this.userRepo.save(checkUser);
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

  async addUserCreateTask(idUser: number, codeTask: string) {
    const checkUser = await this.checkUser(idUser);
    if (!checkUser) {
      throw new NotFoundException();
    }
    try {
      return this.taskService.addUserCreateTask(codeTask, idUser);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async assignTask(id: number, codeIdTask: string) {
    const checkUser = await this.checkUser(id);
    if (!checkUser) {
      throw new NotFoundException();
    }
    try {
      return this.taskService.assignTask(codeIdTask, checkUser);
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
    try {
      checkUser.isDeleted = checkUser.id;
      return this.userRepo.save(checkUser);
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
}
