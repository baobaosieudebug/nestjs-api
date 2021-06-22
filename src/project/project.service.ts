import {
  HttpException,
  HttpStatus,
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
      throw new NotFoundException();
    }
    return response;
  }

  async getOneByCode(code: string) {
    return await this.projectRepo.getByCode(code);
  }

  async getOneByCodeOrFail(code: string) {
    const response = await this.getOneByCode(code);
    if (!response) {
      throw new NotFoundException();
    }
    return response;
  }

  async getAllProject() {
    return await this.projectRepo.getAllProject();
  }

  async checkProjectByCode(code: string) {
    const project = await this.getOneByCodeOrFail(code);
    if (!project) {
      return null;
    }
    return project;
  }

  async checkProjectByID(id: number) {
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

  async addProject(orgID: number, code: string) {
    const checkProject = await this.checkProjectByCode(code);
    if (!checkProject) {
      throw new NotFoundException();
    }
    const existProject = await this.projectRepo.isProjectExistInOrg(
      orgID,
      code,
    );
    if (existProject) {
      return new HttpException(
        'Project exist in Organization',
        HttpStatus.NOT_ACCEPTABLE,
      );
    }
    try {
      return await this.projectRepo.update(checkProject.id, {
        organizationID: orgID,
      });
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async addUser(code: string, idUser: number) {
    const checkProject = await this.checkProjectByCode(code);
    if (!checkProject) {
      throw new NotFoundException();
    }
    try {
      return this.userService.addUserInProject(idUser, checkProject.id);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async addTask(code: string, codeTask: string) {
    const checkProject = await this.checkProjectByCode(code);
    if (!checkProject) {
      throw new NotFoundException();
    }
    try {
      return this.taskService.addTaskInProject(codeTask, checkProject.id);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async editProject(id: number, dto: EditProjectDTO) {
    const checkProject = this.checkProjectByID(id);
    if (!checkProject) {
      throw new NotFoundException();
    }
    const existCode = this.projectRepo.getByCode(dto.code);
    if (existCode) {
      throw new NotFoundException('Code must be unique');
    }
    try {
      return await this.projectRepo.update(id, dto);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async checkDeleted(id: number) {
    const project = this.projectRepo.getByIdWithDelete(id);
    if (!project) {
      return null;
    }
    return project;
  }

  async remove(id: number) {
    const checkProject = this.checkProjectByID(id);
    if (!checkProject) {
      throw new NotFoundException();
    }
    try {
      const project = this.getOneById(id);
      (await project).isDeleted = (await project).id;
      return this.projectRepo.save(await project);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async removeUserInProject(idUser: number, code: string) {
    const checkProject = await this.checkProjectByCode(code);
    if (!checkProject) {
      throw new NotFoundException();
    }
    const project = await this.projectRepo.getByCode(code);
    project.users = project.users.filter((res) => res.id != idUser);
    return await this.projectRepo.save(project);
  }

  async removeTaskInProject(code: string, codeTask: string) {
    const checkProject = this.checkProjectByCode(code);
    if (!checkProject) {
      throw new NotFoundException();
    }
    const project = await this.projectRepo.getByCode(code);
    project.tasks = project.tasks.filter((res) => res.code != codeTask);
    return await this.projectRepo.save(project);
  }

  async removeProject(orgID: number, code: string) {
    const checkProject = await this.checkProjectByCode(code);
    if (!checkProject) {
      throw new NotFoundException();
    }
    const existProject = await this.projectRepo.isProjectExistInOrg(
      orgID,
      code,
    );

    if (!existProject) {
      return new HttpException(
        'Project not exist in Organization',
        HttpStatus.NOT_FOUND,
      );
    }
    try {
      return await this.projectRepo.update(checkProject.id, {
        organizationID: null,
      });
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
}
