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
    const checkUser = await this.userRepo.getOneAndGroupRelation(idUser);
    if (!checkUser) {
      throw new NotFoundException('User not found');
    }
    try {
      const group = await this.groupRepo.getOneById(idGroup);
      checkUser.groups.push(group);
      return await this.userRepo.save(checkUser);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async addUserInProject(idUser: number, projectId: number) {
    const checkUser = await this.getOneByIdOrFail(idUser);
    if (checkUser) {
      try {
        const project = await this.projectRepo.getOneAndUserRelation(projectId);
        await project.users.push(checkUser);
        return await this.projectRepo.save(project);
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
  async getAllUserByIdProject(projectId: number) {
    try {
      return await this.userRepo.getAllUserByIdProject(projectId);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async getAllUserByIdGroup(idGroup: number) {
    try {
      return await this.userRepo.getAllUserByIdGroup(idGroup);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
}
