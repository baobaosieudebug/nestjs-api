import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { ProjectRepository } from './project.repository';
import { AddProjectDTO } from './dto/add-project.dto';
import { EditProjectDTO } from './dto/edit-project.dto';
import { UsersService } from '../user/users.service';
import { TaskService } from '../task/task.service';
import { GetProjectRO } from "./ro/get-project.ro";
import { GetOrganizationRO } from "../organization/ro/get-organization.ro";
import { OrganizationEntity } from "../organization/organization.entity";
import { ProjectEntity } from "./project.entity";

@Injectable()
export class ProjectService {
  private readonly logger = new Logger(ProjectService.name);
  constructor(
    private readonly projectRepo: ProjectRepository,
    private readonly userService: UsersService,
    private readonly taskService: TaskService,
  ) {}

  async getOneById(id: number) {
    return await this.projectRepo.getById(id);
  }

  async getOneByIdOrFail(id: number) {
    const project = await this.getOneById(id);
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    return project;
  }

  async getOneByCode(code: string) {
    return await this.projectRepo.getByCode(code);
  }

  async getOneByCodeOrFail(code: string) {
    const project = await this.getOneByCode(code);
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    return project;
  }

  async getAllProject() {
    return await this.projectRepo.getAll();
  }

  async getAllTaskById(id: number) {
    try {
      return await this.taskService.getAllTaskByIdProject(id);
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException();
    }
  }

  async getAllUserById(id: number) {
    await this.getOneByIdOrFail(id);
    try {
      return await this.userService.getAllUserByIdProject(id);
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException();
    }
  }

  async getAllProjectByIdOrg(orgId: number): Promise<GetProjectRO[]> {
    const oldArray = await this.projectRepo.getProjectByIdOrg(orgId);
    const newArray: GetProjectRO[] = [];
    for (let i = 0; i < oldArray.length; i++) {
      const projectRO = await this.getProjectResponse(oldArray[i]);
      newArray.push(projectRO);
    }
    return newArray;
  }

  async getProjectResponse(project: ProjectEntity): Promise<GetProjectRO> {
    const response = new GetProjectRO();
    response.name = project.name;
    response.code = project.code;
    response.organizationId = project.organizationId;
    return response;
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
      this.logger.error(e);
      throw new InternalServerErrorException();
    }
  }

  async addProject(orgId: number, code: string): Promise<GetProjectRO> {
    const project = await this.getOneByCodeOrFail(code);
    await this.checkExistCode(code, orgId);
    try {
      project.organizationId = orgId;
      await this.projectRepo.update(project.id, project);
      return await this.getProjectResponse(project);
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException();
    }
  }

  async addUser(code: string, idUser: number) {
    const checkProject = await this.getOneByCodeOrFail(code);
    try {
      return this.userService.addUserInProject(idUser, checkProject.id);
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException();
    }
  }

  async addTask(code: string, codeTask: string) {
    const checkProject = await this.getOneByCodeOrFail(code);

    try {
      return this.taskService.addTaskInProject(codeTask, checkProject.id);
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException();
    }
  }

  async edit(id: number, dto: EditProjectDTO) {
    await this.getOneByIdOrFail(id);
    try {
      return await this.projectRepo.update(id, dto);
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException();
    }
  }

  async remove(id: number) {
    await this.getOneByIdOrFail(id);

    try {
      return await this.projectRepo.update(id, { isDeleted: id });
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException();
    }
  }

  async removeUserInProject(idUser: number, code: string) {
    const project = await this.getOneByCodeOrFail(code);
    await this.projectRepo.isUserExist(idUser);
    try {
      return this.projectRepo.removeUserInProject(idUser, project.id);
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException();
    }
  }

  async removeTaskInProject(code: string, codeTask: string) {
    const checkProject = await this.getOneByCodeOrFail(code);
    try {
      return this.taskService.removeTask(checkProject.id, codeTask);
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException();
    }
  }

  async removeProject(orgId: number, code: string): Promise<GetProjectRO> {
    const project = await this.getOneByCodeOrFail(code);
    await this.checkExistCode(code, orgId);
    try {
      project.organizationId = null;
      await this.projectRepo.update(project.id, project);
      return this.getProjectResponse(project);
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException();
    }
  }
}
