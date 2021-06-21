import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ProjectRepository } from './project.repository';
import { AddProjectDTO } from './dto/add-project.dto';
import { EditProjectDTO } from './dto/edit-project.dto';
import { OrganizationEntity } from 'src/organization/organization.entity';
import { UsersService } from 'src/user/users.service';
import { TaskService } from 'src/task/task.service';

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
    if ((await this.getOneById(id)) == null) {
      throw new NotFoundException();
    } else {
      return await this.getOneById(id);
    }
  }

  async getOneByCodeId(codeId: string) {
    return await this.projectRepo.getByCodeId(codeId);
  }

  async getOneByCodeIdOrFail(codeId: string) {
    const response = await this.getOneByCodeId(codeId);
    if (!response) {
      throw new NotFoundException();
    }
    return response;
  }

  async getAllProject() {
    return await this.projectRepo.getAllProject();
  }

  async checkProject(codeId: string) {
    const project = await this.getOneByCodeIdOrFail(codeId);
    if (!project) {
      return null;
    }
    return project;
  }

  async checkProjectID(id: number) {
    const project = await this.projectRepo.getById(id);
    if (!project) {
      return null;
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

  async addProject(organization: OrganizationEntity, codeId: string) {
    const checkProject = this.checkProject(codeId);
    if (!checkProject) {
      throw new NotFoundException();
    }
    const project = await this.projectRepo.getByCodeId(codeId);
    project.organization = organization;
    return await this.projectRepo.save(project);
  }

  async addUser(codeId: string, idUser: number) {
    const checkProject = this.checkProject(codeId);
    if (!checkProject) {
      throw new NotFoundException();
    }
    const project = await this.projectRepo.getByCodeId(codeId);
    return this.userService.addUserInProject(idUser, project);
  }

  async addTask(codeId: string, codeIdTask: string) {
    const checkProject = this.checkProject(codeId);
    if (!checkProject) {
      throw new NotFoundException();
    }
    const project = await this.projectRepo.getByCodeId(codeId);
    return this.taskService.addTaskInProject(codeIdTask, project);
  }

  async editProject(id: number, dto: EditProjectDTO) {
    const checkProject = this.checkProjectID(id);
    if (!checkProject) {
      throw new NotFoundException();
    }
    try {
      return await this.projectRepo.update(id, dto);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async removeProject(id: number) {
    const checkProject = this.checkProjectID(id);
    if (!checkProject) {
      throw new NotFoundException();
    }
    try {
      const project = this.getOneById(id);
      (await project).isDelete = (await project).id;
      return this.projectRepo.save(await project);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async removeUserInProject(idUser: number, codeId: string) {
    const checkProject = await this.checkProject(codeId);
    if (!checkProject) {
      throw new NotFoundException();
    }
    const project = await this.projectRepo.getByCodeId(codeId);
    project.users = project.users.filter((res) => res.id != idUser);
    return await this.projectRepo.save(project);
  }

  async removeTaskInProject(codeId: string, codeIdTask: string) {
    const checkProject = this.checkProject(codeId);
    if (!checkProject) {
      throw new NotFoundException();
    }
    const project = await this.projectRepo.getByCodeId(codeId);
    project.tasks = project.tasks.filter((res) => res.codeId != codeIdTask);
    return await this.projectRepo.save(project);
  }
}
