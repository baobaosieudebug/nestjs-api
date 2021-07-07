import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { ProjectRepository } from './project.repository';
import { AddProjectDTO } from './dto/add-project.dto';
import { ProjectEntity } from './project.entity';
import { ProjectRO } from './ro/project.ro';
import { OrganizationService } from '../organization/organization.service';

@Injectable()
export class ProjectService {
  private readonly logger = new Logger(ProjectService.name);
  constructor(private readonly repo: ProjectRepository, private readonly orgService: OrganizationService) {}

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

  // async getAllTaskById(id: number): Promise<GetTaskRO[]> {
  //   try {
  //     return await this.taskService.getAllTaskByIdProject(id);
  //   } catch (e) {
  //     this.logger.error(e);
  //     throw new InternalServerErrorException();
  //   }
  // }

  // async getAllUserById(id: number): Promise<GetUserRO[]> {
  //   await this.getOneByIdOrFail(id);
  //   try {
  //     return await this.userService.getAllUserByIdProject(id);
  //   } catch (e) {
  //     this.logger.error(e);
  //     throw new InternalServerErrorException();
  //   }
  // }

  // async getAllProjectByIdOrg(orgId: number): Promise<HandleProjectRO[]> {
  //   const oldArray = await this.repo.getProjectByIdOrg(orgId);
  //   const newArray: GetProjectRO[] = [];
  //   for (let i = 0; i < oldArray.length; i++) {
  //     const projectRO = await this.handleProjectResponse(oldArray[i]);
  //     newArray.push(projectRO);
  //   }
  //   return newArray;
  // }

  async mappingProjectRO(project: ProjectEntity): Promise<ProjectRO> {
    const response = new ProjectRO();
    response.name = project.name;
    response.organizationId = project.organizationId;
    return response;
  }

  // async checkExistCode(code: string, orgId: number) {
  //   const project = await this.repo.isProjectExist(orgId, code);
  //   if (project) {
  //     throw new NotFoundException('Project Exist');
  //   }
  // }

  async checkProjectExist(id: number) {
    const project = await this.repo.checkProjectExist(id);
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    return project;
  }

  async create(payload, dto: AddProjectDTO) {
    await this.orgService.isOwner(payload);
    try {
      const project = this.repo.create(dto);
      project.createById = payload.id;
      project.adminId = payload.id;
      project.organizationId = payload.organizationCode.id;
      await this.repo.save(project);
      return this.mappingProjectRO(project);
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException();
    }
  }

  // async addProject(orgId: number, code: string): Promise<ProjectRO> {
  //   const project = await this.getOneByCodeOrFail(code);
  //   await this.checkExistCode(code, orgId);
  //   try {
  //     project.organizationId = orgId;
  //     await this.repo.update(project.id, project);
  //     return await this.mappingProjectRO(project);
  //   } catch (e) {
  //     this.logger.error(e);
  //     throw new InternalServerErrorException();
  //   }
  // }

  // async addUser(code: string, idUser: number): Promise<HandleUserRO> {
  //   const checkProject = await this.getOneByCodeOrFail(code);
  //   try {
  //     return this.userService.addUserInProject(idUser, checkProject.id);
  //   } catch (e) {
  //     this.logger.error(e);
  //     throw new InternalServerErrorException();
  //   }
  // }

  // async addTask(code: string, codeTask: string): Promise<HandleTaskRO> {
  //   const checkProject = await this.getOneByCodeOrFail(code);
  //   try {
  //     return this.taskService.addTaskInProject(codeTask, checkProject.id);
  //   } catch (e) {
  //     this.logger.error(e);
  //     throw new InternalServerErrorException();
  //   }
  // }

  // async edit(payload, dto: EditProjectDTO): Promise<ProjectRO> {
  //   const old = await this.getOneByCodeOrFail(payload.organizationCode.code);
  //   try {
  //     const project = await this.repo.merge(old, dto);
  //     await this.repo.update(old.id, project);
  //     return this.mappingProjectRO(project);
  //   } catch (e) {
  //     this.logger.error(e);
  //     throw new InternalServerErrorException();
  //   }
  // }

  // async delete(id: string) {
  //   const project = await this.getOneByCode(id);
  //   try {
  //     return await this.repo.delete(project.id);
  //     // project.isDeleted = project.id;
  //     // await this.repo.update(id, project);
  //     // return this.mappingProjectRO(project);
  //   } catch (e) {
  //     this.logger.error(e);
  //     throw new InternalServerErrorException();
  //   }
  // }

  // async removeUserInProject(idUser: number, code: string): Promise<HandleProjectRO> {
  //   const project = await this.getOneByCodeOrFail(code);
  //   await this.repo.isUserExist(idUser);
  //   try {
  //     await this.repo.removeUserInProject(idUser, project.id);
  //     return this.handleProjectResponse(project);
  //   } catch (e) {
  //     this.logger.error(e);
  //     throw new InternalServerErrorException();
  //   }
  // }

  // async removeTaskInProject(code: string, codeTask: string): Promise<HandleTaskRO> {
  //   const checkProject = await this.getOneByCodeOrFail(code);
  //   try {
  //     return this.taskService.removeTask(checkProject.id, codeTask);
  //   } catch (e) {
  //     this.logger.error(e);
  //     throw new InternalServerErrorException();
  //   }
  // }

  // async removeProject(orgId: number, code: string): Promise<HandleProjectRO> {
  //   const project = await this.getOneByCodeOrFail(code);
  //   await this.checkExistCode(code, orgId);
  //   try {
  //     project.organizationId = null;
  //     await this.repo.update(project.id, project);
  //     return this.handleProjectResponse(project);
  //   } catch (e) {
  //     this.logger.error(e);
  //     throw new InternalServerErrorException();
  //   }
  // }
}
