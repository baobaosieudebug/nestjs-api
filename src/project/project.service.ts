import {
  BadRequestException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { UserProjectEntity } from '../user/entities/user-project.entity';
import { ProjectEntity } from './project.entity';
import { OrganizationService } from '../organization/organization.service';
import { UserService } from '../user/user.service';
import { UserProjectRepository } from '../user/repository/user-project.repository';
import { OrganizationRepository } from '../organization/organization.repository';
import { ProjectRepository } from './project.repository';
import { AddProjectDTO } from './dto/add-project.dto';
import { EditProjectDTO } from './dto/edit-project.dto';
import { ProjectRO } from './ro/project.ro';
import { UserRO } from '../user/ro/user.ro';

@Injectable()
export class ProjectService {
  private readonly logger = new Logger(ProjectService.name);

  constructor(
    private readonly repo: ProjectRepository,
    @Inject(forwardRef(() => OrganizationService))
    private readonly orgService: OrganizationService,
    private readonly orgRepo: OrganizationRepository,
    private readonly userProjectRepo: UserProjectRepository,
    private readonly userService: UserService,
  ) {}

  async getOneByCode(code: string): Promise<ProjectEntity> {
    return await this.repo.getByCode(code);
  }

  async getOneById(id: number): Promise<ProjectEntity> {
    return await this.repo.getById(id);
  }

  async getOneByCodeOrFail(code: string): Promise<ProjectEntity> {
    const project = await this.getOneByCode(code);
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    return project;
  }

  async mappingProjectRO(project: ProjectEntity): Promise<ProjectRO> {
    const response = new ProjectRO();
    response.id = project.id;
    response.code = project.code;
    response.name = project.name;
    response.description = project.description;
    return response;
  }

  async mappingListProjectRO(oldArray: ProjectEntity[]): Promise<ProjectRO[]> {
    const newArray: ProjectRO[] = [];
    for (let i = 0; i < oldArray.length; i++) {
      const projectRO = await this.mappingProjectRO(oldArray[i]);
      newArray.push(projectRO);
    }
    return newArray;
  }

  async mappingListProjectEntity(oldArray: UserProjectEntity[]): Promise<ProjectEntity[]> {
    const newArray: ProjectEntity[] = [];
    for (let i = 0; i < oldArray.length; i++) {
      const project = await this.getOneById(oldArray[i].projectId);
      newArray.push(project);
    }
    return newArray;
  }

  async checkProjectExist(id: number) {
    const project = await this.repo.checkProjectExist(id);
    if (!project) {
      throw new NotFoundException('Project not found');
    }
    return project;
  }

  async isProjectExist(payload, projectCode: string) {
    const isProjectExist = await this.repo.isProjectExist(payload.organizationCode.id, projectCode);
    if (!isProjectExist) {
      throw new ForbiddenException('Forbidden');
    }
  }

  async create(payload, dto: AddProjectDTO): Promise<ProjectRO> {
    await this.orgService.isOwner(payload);
    const isProjectExist = await this.repo.isProjectExist(payload.organizationCode.id, dto.code);
    if (isProjectExist) {
      throw new BadRequestException('Project Exist in Organization');
    }
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

  async addUser(payload, projectCode: string, id: number): Promise<UserRO> {
    const project = await this.getOneByCodeOrFail(projectCode);
    const isUserExist = await this.userProjectRepo.isUserExist(project.id, id);
    if (isUserExist) {
      throw new BadRequestException('User Exist Project');
    }
    if (payload.roles !== 'admin' && !payload.organizationCode) {
      throw new ForbiddenException('Forbidden');
    }
    try {
      return await this.userService.addUser(project.id, id);
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException();
    }
  }

  async getInfo(payload, code: string): Promise<ProjectRO> {
    const project = await this.getOneByCodeOrFail(code);
    const isUserExistInProject = await this.userProjectRepo.isUserExist(project.id, payload.id);
    if (!payload.organizationCode && !isUserExistInProject) {
      throw new ForbiddenException('Forbidden');
    }
    try {
      return this.mappingProjectRO(project);
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException();
    }
  }

  async getListUser(payload, code: string): Promise<UserRO[]> {
    const project = await this.getOneByCodeOrFail(code);
    if (payload.roles === 'user' && project.createById !== payload.id) {
      throw new ForbiddenException('Forbidden');
    }

    try {
      return this.userService.getListUser(project.id);
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException();
    }
  }

  async getListUserByUser(payload, projectCode: string): Promise<UserRO[]> {
    const project = await this.getOneByCodeOrFail(projectCode);
    const isUserExist = await this.userProjectRepo.isUserExist(project.id, payload.id);
    if (payload.roles === 'admin' || (!isUserExist && payload.id !== project.createById)) {
      throw new ForbiddenException('Forbidden');
    }
    try {
      return this.userService.getListUser(project.id);
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException();
    }
  }

  async getList(payload): Promise<ProjectRO[]> {
    if (!payload.organizationCode || payload.id !== payload.organizationCode.ownerId) {
      const userProjectArray = await this.userProjectRepo.getListProject(payload.id);
      const projectArray = await this.mappingListProjectEntity(userProjectArray);
      return this.mappingListProjectRO(projectArray);
    }
    try {
      const oldArray = await this.repo.getAll(payload.organizationCode.id);
      return this.mappingListProjectRO(oldArray);
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException();
    }
  }

  async edit(payload, code: string, dto: EditProjectDTO): Promise<ProjectRO> {
    const old = await this.getOneByCodeOrFail(code);
    const isOwner = await this.repo.isOwner(code, payload.id);
    if (!isOwner && payload.id !== old.adminId) {
      throw new ForbiddenException('Forbidden');
    }
    const isExistCode = await this.repo.isExistCode(old.id, dto.code);
    if (isExistCode) {
      throw new BadRequestException('Code must be unique');
    }
    try {
      const project = await this.repo.merge(old, dto);
      await this.repo.update(old.id, project);
      return this.mappingProjectRO(project);
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException();
    }
  }

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
}
