import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { OrganizationService } from '../organization/organization.service';
import { ProjectService } from '../project/project.service';
import { TaskRepository } from './task.respository';
import { AddTaskDTO } from './dto/add-task.dto';
import { TaskEntity } from './task.entity';
import { TaskRO } from './ro/task.ro';
import { EditTaskDTO } from './dto/edit-task.dto';
import { AuthService } from '../auth/auth.service';
import { ActionRepository } from '../auth/repository/action.repository';
import { ResourceRepository } from '../auth/repository/resource.repository';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);
  constructor(
    private readonly repo: TaskRepository,
    private readonly orgService: OrganizationService,
    private readonly projectService: ProjectService,
    private readonly authService: AuthService,
    private readonly actionRepo: ActionRepository,
    private readonly resourceRepo: ResourceRepository,
  ) {}

  async mappingTaskRO(task: TaskEntity): Promise<TaskRO> {
    const response = new TaskRO();
    response.name = task.name;
    response.code = task.code;
    response.description = task.description;
    response.dateBegin = task.dateBegin;
    response.dateEnd = task.dateEnd;
    return response;
  }

  async mappingListTaskRO(oldArray: TaskEntity[]): Promise<TaskRO[]> {
    const newArray: TaskRO[] = [];
    for (let i = 0; i < oldArray.length; i++) {
      const taskRO = await this.mappingTaskRO(oldArray[i]);
      newArray.push(taskRO);
    }
    return newArray;
  }

  async getAll(payload, projectCode: string): Promise<TaskRO[]> {
    const project = await this.projectService.getOneByCodeOrFail(projectCode);
    if (payload.roles === 'user') {
      await this.orgService.isOwner(payload);
    }
    await this.projectService.isProjectExist(payload, projectCode);
    try {
      const oldArray = await this.repo.getAll(project.id);
      return this.mappingListTaskRO(oldArray);
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException();
    }
  }

  async isTaskExist(code: string, projectId: number) {
    const isTaskExist = await this.repo.isExistTaskCode(code, projectId);
    if (isTaskExist) {
      throw new BadRequestException('Code must be unique in project');
    }
  }

  async isExistPermission(actionId: number, resourceId: number, roleId: number) {
    const isExistPermission = await this.authService.isExistPermission(actionId, resourceId, roleId);
    if (!isExistPermission) {
      throw new ForbiddenException('Forbidden');
    }
  }

  async create(payload, projectCode: string, dto: AddTaskDTO): Promise<TaskRO> {
    const resourceId = await this.resourceRepo.getIdByCode('task');
    const actionId = await this.actionRepo.getIdByCode('create', resourceId);
    await this.isExistPermission(actionId, resourceId, payload.role);
    const project = await this.projectService.getOneByCodeOrFail(projectCode);
    await this.isTaskExist(dto.code, project.id);
    try {
      const task = this.repo.create(dto);
      task.createdAt = new Date();
      task.createUserId = payload.id;
      task.projectId = project.id;
      await this.repo.save(task);
      return this.mappingTaskRO(task);
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException();
    }
  }

  async delete(payload, code: string) {
    const resourceId = await this.resourceRepo.getIdByCode('task');
    const actionId = await this.actionRepo.getIdByCode('delete', resourceId);
    await this.isExistPermission(actionId, resourceId, payload.role);
    const task = await this.getOneByCode(code);
    try {
      task.isDeleted = payload.id;
      await this.repo.update(task.id, task);
      return task.id;
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException();
    }
  }

  async getOneById(id: number) {
    return await this.repo.getById(id);
  }

  async getOneByIdOrFail(id: number) {
    const task = await this.getOneById(id);
    if (!task) {
      throw new NotFoundException('Task Not Found');
    }
    return task;
  }

  async getOneByCode(code: string) {
    return await this.repo.getByCode(code);
  }

  // async getOneByCodeOrFail(code: string) {
  //   const task = await this.getOneByCode(code);
  //   if (!task) {
  //     throw new NotFoundException('Task not found');
  //   }
  //   return task;
  // }

  // async checkExistCode(code: string, projectId: number) {
  //   const checkExist = await this.repo.isExistTaskCode(code, projectId);
  //   if (checkExist) {
  //     throw new NotFoundException('Task Exist');
  //   }
  // }

  // async addTaskInProject(code: string, projectId: number): Promise<HandleTaskRO> {
  //   const task = await this.getOneByCodeOrFail(code);
  //   await this.checkExistCode(code, projectId);
  //   try {
  //     task.projectId = projectId;
  //     await this.repo.update(task.id, task);
  //     return this.handleTaskResponse(task);
  //   } catch (e) {
  //     this.logger.error(e);
  //     throw new InternalServerErrorException();
  //   }
  // }

  // async assignTask(code: string, idUser: number): Promise<HandleTaskRO> {
  //   const task = await this.getOneByCodeOrFail(code);
  //   await this.repo.isAssignTask(idUser, code);
  //   try {
  //     task.assignUserId = idUser;
  //     await this.repo.update(task.id, task);
  //     return this.handleTaskResponse(task);
  //   } catch (e) {
  //     this.logger.error(e);
  //     throw new InternalServerErrorException();
  //   }
  // }

  async edit(payload, projectCode: string, id: number, dto: EditTaskDTO): Promise<TaskRO> {
    const resourceId = await this.resourceRepo.getIdByCode('task');
    const actionId = await this.actionRepo.getIdByCode('edit', resourceId);
    await this.isExistPermission(actionId, resourceId, payload.role);
    const project = await this.projectService.getOneByCodeOrFail(projectCode);
    await this.projectService.isProjectExist(payload, projectCode);
    const old = await this.getOneByIdOrFail(id);
    await this.isTaskExist(dto.code, project.id);
    try {
      const task = await this.repo.merge(old, dto);
      await this.repo.update(id, task);
      return this.mappingTaskRO(task);
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException();
    }
  }

  // async removeTask(projectId: number, code: string): Promise<HandleTaskRO> {
  //   const checkTask = await this.getOneByCodeOrFail(code);
  //   await this.repo.isExistTaskCode(code, projectId);
  //   try {
  //     checkTask.projectId = null;
  //     await this.repo.update(checkTask.id, checkTask);
  //     return this.handleTaskResponse(checkTask);
  //   } catch (e) {
  //     this.logger.error(e);
  //     throw new InternalServerErrorException();
  //   }
  // }

  // async getAllTaskByIdProject(projectId: number): Promise<GetTaskRO[]> {
  //   try {
  //     const oldArray = await this.repo.getAllTaskByIdProject(projectId);
  //     const newArray: GetTaskRO[] = [];
  //     for (let i = 0; i < oldArray.length; i++) {
  //       const taskRO = await this.getTaskResponse(oldArray[i]);
  //       newArray.push(taskRO);
  //     }
  //     return newArray;
  //   } catch (e) {
  //     this.logger.error(e);
  //     throw new InternalServerErrorException();
  //   }
  // }
}
