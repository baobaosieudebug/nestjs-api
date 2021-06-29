import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AddUserDTO } from './dto/add-user.dto';
import { EditUserDTO } from './dto/edit-user.dto';
import { UserRepository } from './user.repository';
import { ProjectRepository } from '../project/project.repository';
import { GroupRepository } from '../group/group.repository';
import { TaskService } from '../task/task.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly taskService: TaskService,
    private readonly projectRepo: ProjectRepository,
    private readonly groupRepo: GroupRepository,
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

  async create(user: AddUserDTO) {
    try {
      user.password = await bcrypt.hash(user.password, 12);
      const newUser = this.userRepo.create(user);
      return await this.userRepo.save(newUser);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async addUser(idUser: number, idGroup: number) {
    const checkUser = await this.getOneByIdOrFail(idUser);
    if (checkUser) {
      try {
        const group = await this.groupRepo.getOneById(idGroup);
        await checkUser.groups.push(group);
        await this.userRepo.save(checkUser);
        return checkUser;
      } catch (e) {
        throw new InternalServerErrorException();
      }
    }
  }

  async addUserInProject(idUser: number, idProject: number) {
    const checkUser = await this.getOneByIdOrFail(idUser);
    if (checkUser) {
      try {
        const project = await this.projectRepo.getById(idProject);
        await checkUser.projects.push(project);
        await this.userRepo.save(checkUser);
        return checkUser;
      } catch (e) {
        throw new InternalServerErrorException();
      }
    }
  }

  async assignTask(idUser: number, codeTask: string) {
    const checkUser = await this.getOneByIdOrFail(idUser);
    if (checkUser) {
      try {
        return this.taskService.assignTask(codeTask, idUser);
      } catch (e) {
        throw new InternalServerErrorException();
      }
    }
  }

  async update(id: number, dto: EditUserDTO) {
    const checkUser = await this.getOneByIdOrFail(id);
    if (checkUser) {
      try {
        dto.password = await bcrypt.hash(dto.password, 12);
        return this.userRepo.update(id, dto);
      } catch (e) {
        throw new InternalServerErrorException();
      }
    }
  }

  async remove(id: number) {
    const checkUser = await this.getOneByIdOrFail(id);
    if (checkUser) {
      try {
        return await this.userRepo.update(id, { isDeleted: id });
      } catch (e) {
        throw new InternalServerErrorException();
      }
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
}
