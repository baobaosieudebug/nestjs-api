import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ProjectRepository } from './project.repository';
import { AddProjectDTO } from './dto/add-project.dto';
import { EditProjectDTO } from './dto/edit-project.dto';
import { UsersService } from '../user/users.service';
import { TaskService } from '../task/task.service';

@Injectable()
export class ProjectService {
  constructor(
    private readonly projectRepo: ProjectRepository,
    private readonly userService: UsersService,
    private readonly taskService: TaskService,
  ) {}

  async getOneById(id: number) {
    return await this.projectRepo.getById(id);
  }

  async getOneByIdOrFail(id: number) {
    const response = await this.getOneById(id);
    if (!response) {
      throw new NotFoundException('Project not found');
    }
    return response;
  }

  async getOneByCode(code: string) {
    return await this.projectRepo.getByCode(code);
  }

  async getOneByCodeOrFail(code: string) {
    const response = await this.getOneByCode(code);
    if (!response) {
      throw new NotFoundException('Project not found');
    }
    return response;
  }

  async getAllProject() {
    return await this.projectRepo.getAll();
  }

  async getAllTaskById(id: number) {
    try {
      return await this.taskService.getAllTaskByIdProject(id);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async getAllUserById(id: number) {
    const checkProject = await this.getOneByIdOrFail(id);
    if (checkProject) {
      try {
        return await this.userService.getAllUserByIdProject(id);
      } catch (e) {
        throw new InternalServerErrorException();
      }
    }
  }

  async checkExistCode(code: string, orgId: number) {
    const project = await this.projectRepo.isProjectExist(orgId, code);
    if (project) {
      throw new NotFoundException('Project Exist');
    }
  }

  async checkProjectExist(id: number) {
    const project = await this.projectRepo.checkProjectExist(id);
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    return project;
  }

  async createProject(dto: AddProjectDTO) {
    try {
      const project = this.projectRepo.create(dto);
      return await this.projectRepo.save(project);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async addProject(orgId: number, code: string) {
    const project = await this.getOneByCodeOrFail(code);
    await this.checkExistCode(code, orgId);
    try {
      return await this.projectRepo.update(project.id, {
        organizationId: orgId,
      });
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async addUser(code: string, idUser: number) {
    const checkProject = await this.getOneByCodeOrFail(code);
    try {
      return this.userService.addUserInProject(idUser, checkProject.id);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async addTask(code: string, codeTask: string) {
    const checkProject = await this.getOneByCodeOrFail(code);

    try {
      return this.taskService.addTaskInProject(codeTask, checkProject.id);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async edit(id: number, dto: EditProjectDTO) {
    await this.getOneByIdOrFail(id);
    try {
      return await this.projectRepo.update(id, dto);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async remove(id: number) {
    await this.getOneByIdOrFail(id);

    try {
      return await this.projectRepo.update(id, { isDeleted: id });
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async removeUserInProject(idUser: number, code: string) {
    const project = await this.getOneByCodeOrFail(code);
    await this.projectRepo.isUserExist(idUser);
    try {
      return this.projectRepo.removeUserInProject(idUser, project.id);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async removeTaskInProject(code: string, codeTask: string) {
    const checkProject = await this.getOneByCodeOrFail(code);
    try {
      return this.taskService.removeTask(checkProject.id, codeTask);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async removeProject(orgId: number, code: string) {
    const project = await this.getOneByCodeOrFail(code);
    await this.checkExistCode(code, orgId);
    try {
      return await this.projectRepo.update(project.id, {
        organizationId: null,
      });
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async getAllProjectByIdOrg(orgId: number) {
    return await this.projectRepo.getProjectByIdOrg(orgId);
  }
}
