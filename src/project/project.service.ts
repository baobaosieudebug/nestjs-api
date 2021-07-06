import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { ProjectRepository } from './project.repository';
import { AddProjectDTO } from './dto/add-project.dto';
import { EditProjectDTO } from './dto/edit-project.dto';
import { UsersService } from '../user/users.service';
import { TaskService } from '../task/task.service';
import { GetProjectRO } from './ro/get-project.ro';
import { ProjectEntity } from './project.entity';
import { GetTaskRO } from '../task/ro/get-task.ro';
import { GetUserRO } from '../user/ro/get-user.ro';
import { HandleProjectRO } from './ro/handle-project.ro';
import { HandleTaskRO } from '../task/ro/handle-task.ro';
import { HandleUserRO } from '../user/ro/handle-user.ro';

@Injectable()
export class ProjectService {
  private readonly logger = new Logger(ProjectService.name);
  constructor(
    private readonly repo: ProjectRepository,
    private readonly userService: UsersService,
    private readonly taskService: TaskService,
  ) {}

  async getOneById(id: number): Promise<ProjectEntity> {
    return await this.repo.getById(id);
  }

  async getOneByIdOrFail(id: number): Promise<ProjectEntity> {
    const project = await this.getOneById(id);
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    return project;
  }

  async getOneByCode(code: string): Promise<ProjectEntity> {
    return await this.repo.getByCode(code);
  }

  async getOneByCodeOrFail(code: string): Promise<ProjectEntity> {
    const project = await this.getOneByCode(code);
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    return project;
  }

  async getAll(): Promise<GetProjectRO[]> {
    const oldArray = await this.repo.getAll();
    const newArray: GetProjectRO[] = [];
    for (let i = 0; i < oldArray.length; i++) {
      const projectRO = await this.getProjectResponse(oldArray[i]);
      newArray.push(projectRO);
    }
    return newArray;
  }

  async getAllTaskById(id: number): Promise<GetTaskRO[]> {
    try {
      return await this.taskService.getAllTaskByIdProject(id);
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException();
    }
  }

  async getAllUserById(id: number): Promise<GetUserRO[]> {
    await this.getOneByIdOrFail(id);
    try {
      return await this.userService.getAllUserByIdProject(id);
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException();
    }
  }

  async getAllProjectByIdOrg(orgId: number): Promise<HandleProjectRO[]> {
    const oldArray = await this.repo.getProjectByIdOrg(orgId);
    const newArray: GetProjectRO[] = [];
    for (let i = 0; i < oldArray.length; i++) {
      const projectRO = await this.handleProjectResponse(oldArray[i]);
      newArray.push(projectRO);
    }
    return newArray;
  }

  async handleProjectResponse(project: ProjectEntity): Promise<HandleProjectRO> {
    const response = new HandleProjectRO();
    response.name = project.name;
    response.code = project.code;
    response.organizationId = project.organizationId;
    return response;
  }

  async getProjectResponse(project: ProjectEntity): Promise<GetProjectRO> {
    const response = new GetProjectRO();
    response.name = project.name;
    response.code = project.code;
    response.organizationId = project.organizationId;
    return response;
  }

  async checkExistCode(code: string, orgId: number) {
    const project = await this.repo.isProjectExist(orgId, code);
    if (project) {
      throw new NotFoundException('Project Exist');
    }
  }

  async checkProjectExist(id: number) {
    const project = await this.repo.checkProjectExist(id);
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    return project;
  }

  async createProject(dto: AddProjectDTO): Promise<HandleProjectRO> {
    try {
      const project = this.repo.create(dto);
      await this.repo.save(project);
      return this.handleProjectResponse(project);
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException();
    }
  }

  async addProject(orgId: number, code: string): Promise<HandleProjectRO> {
    const project = await this.getOneByCodeOrFail(code);
    await this.checkExistCode(code, orgId);
    try {
      project.organizationId = orgId;
      await this.repo.update(project.id, project);
      return await this.handleProjectResponse(project);
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException();
    }
  }

  async addUser(code: string, idUser: number): Promise<HandleUserRO> {
    const checkProject = await this.getOneByCodeOrFail(code);
    try {
      return this.userService.addUserInProject(idUser, checkProject.id);
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException();
    }
  }

  async addTask(code: string, codeTask: string): Promise<HandleTaskRO> {
    const checkProject = await this.getOneByCodeOrFail(code);
    try {
      return this.taskService.addTaskInProject(codeTask, checkProject.id);
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException();
    }
  }

  async edit(id: number, dto: EditProjectDTO): Promise<HandleProjectRO> {
    const old = await this.getOneByIdOrFail(id);
    try {
      const project = await this.repo.merge(old, dto);
      await this.repo.update(id, project);
      return this.handleProjectResponse(project);
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException();
    }
  }

  async delete(id: number): Promise<HandleProjectRO> {
    const project = await this.getOneByIdOrFail(id);
    try {
      project.isDeleted = project.id;
      await this.repo.update(id, project);
      return this.handleProjectResponse(project);
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException();
    }
  }

  async removeUserInProject(idUser: number, code: string): Promise<HandleProjectRO> {
    const project = await this.getOneByCodeOrFail(code);
    await this.repo.isUserExist(idUser);
    try {
      await this.repo.removeUserInProject(idUser, project.id);
      return this.handleProjectResponse(project);
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException();
    }
  }

  async removeTaskInProject(code: string, codeTask: string): Promise<HandleTaskRO> {
    const checkProject = await this.getOneByCodeOrFail(code);
    try {
      return this.taskService.removeTask(checkProject.id, codeTask);
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException();
    }
  }

  async removeProject(orgId: number, code: string): Promise<HandleProjectRO> {
    const project = await this.getOneByCodeOrFail(code);
    await this.checkExistCode(code, orgId);
    try {
      project.organizationId = null;
      await this.repo.update(project.id, project);
      return this.handleProjectResponse(project);
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException();
    }
  }
}
