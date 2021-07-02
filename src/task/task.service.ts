import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { TaskRepository } from './task.respository';
import { AddTaskDTO } from './dto/add-task.dto';
import { EditTaskDTO } from './dto/edit-task.dto';
import { TaskEntity } from './task.entity';
import { GetTaskRO } from './ro/get-task.ro';
import { HandleTaskRO } from './ro/handle-task.ro';

@Injectable()
export class TaskService {
  private readonly logger = new Logger(TaskService.name);
  constructor(private readonly repo: TaskRepository) {}

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

  async getOneByCodeOrFail(code: string) {
    const task = await this.getOneByCode(code);
    if (!task) {
      throw new NotFoundException();
    }
    return task;
  }

  async getAll(): Promise<GetTaskRO[]> {
    const oldArray = await this.repo.getAll();
    const newArray: GetTaskRO[] = [];
    for (let i = 0; i < oldArray.length; i++) {
      const taskRO = await this.getTaskResponse(oldArray[i]);
      newArray.push(taskRO);
    }
    return newArray;
  }

  async getTaskResponse(task: TaskEntity): Promise<GetTaskRO> {
    const response = new GetTaskRO();
    response.name = task.name;
    response.code = task.code;
    response.description = task.description;
    response.dateBegin = task.dateBegin;
    response.dateEnd = task.dateEnd;
    return response;
  }

  async handleTaskResponse(task: TaskEntity): Promise<HandleTaskRO> {
    const response = new HandleTaskRO();
    response.name = task.name;
    response.code = task.code;
    response.description = task.description;
    response.dateBegin = task.dateBegin;
    response.dateEnd = task.dateEnd;
    return response;
  }

  async checkExistCode(code: string, projectId: number) {
    const checkExist = await this.repo.isExistTaskCode(code, projectId);
    if (checkExist) {
      throw new NotFoundException('Task Exist');
    }
  }

  async create(dto: AddTaskDTO): Promise<HandleTaskRO> {
    try {
      const task = this.repo.create(dto);
      task.createdAt = new Date();
      await this.repo.save(task);
      return this.handleTaskResponse(task);
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException();
    }
  }

  async addTaskInProject(code: string, projectId: number): Promise<HandleTaskRO> {
    const task = await this.getOneByCodeOrFail(code);
    await this.checkExistCode(code, projectId);
    try {
      task.projectId = projectId;
      await this.repo.update(task.id, task);
      return this.handleTaskResponse(task);
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException();
    }
  }

  async assignTask(code: string, idUser: number) {
    const task = await this.getOneByCodeOrFail(code);
    await this.repo.isAssignTask(idUser, code);
    try {
      return await this.repo.update(task.id, { assignUserId: idUser });
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException();
    }
  }
  async edit(id: number, dto: EditTaskDTO): Promise<HandleTaskRO> {
    const old = await this.getOneByIdOrFail(id);
    try {
      const task = await this.repo.merge(old, dto);
      await this.repo.update(id, task);
      return this.handleTaskResponse(task);
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException();
    }
  }

  async remove(id: number): Promise<HandleTaskRO> {
    const task = await this.getOneByIdOrFail(id);
    try {
      task.isDeleted = task.id;
      await this.repo.update(id, task);
      return this.handleTaskResponse(task);
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException();
    }
  }

  async removeTask(projectId: number, code: string): Promise<HandleTaskRO> {
    const checkTask = await this.getOneByCodeOrFail(code);
    await this.repo.isExistTaskCode(code, projectId);
    try {
      checkTask.projectId = null;
      await this.repo.update(checkTask.id, checkTask);
      return this.handleTaskResponse(checkTask);
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException();
    }
  }

  async getAllTaskByIdProject(projectId: number): Promise<GetTaskRO[]> {
    try {
      const oldArray = await this.repo.getAllTaskByIdProject(projectId);
      const newArray: GetTaskRO[] = [];
      for (let i = 0; i < oldArray.length; i++) {
        const taskRO = await this.getTaskResponse(oldArray[i]);
        newArray.push(taskRO);
      }
      return newArray;
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException();
    }
  }
}
