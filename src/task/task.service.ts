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
  constructor(private readonly taskRepo: TaskRepository) {}

  async getOneById(id: number) {
    return await this.taskRepo.getById(id);
  }

  async getOneByIdOrFail(id: number) {
    const task = await this.getOneById(id);
    if (!task) {
      throw new NotFoundException('Task Not Found');
    }
    return task;
  }

  async getOneByCode(code: string) {
    return await this.taskRepo.getByCode(code);
  }

  async getOneByCodeOrFail(code: string) {
    const task = await this.getOneByCode(code);
    if (!task) {
      throw new NotFoundException();
    }
    return task;
  }

  async getAll() {
    return await this.taskRepo.getAll();
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
    const checkExist = await this.taskRepo.isExistTaskCode(code, projectId);
    if (checkExist) {
      throw new NotFoundException('Task Exist');
    }
  }

  async create(dto: AddTaskDTO) {
    try {
      const task = this.taskRepo.create(dto);
      task.createdAt = new Date();
      return await this.taskRepo.save(task);
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
      await this.taskRepo.update(task.id, task);
      return this.handleTaskResponse(task);
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException();
    }
  }

  async assignTask(code: string, idUser: number) {
    const task = await this.getOneByCodeOrFail(code);
    await this.taskRepo.isAssignTask(idUser, code);
    try {
      return await this.taskRepo.update(task.id, { assignUserId: idUser });
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException();
    }
  }
  async edit(id: number, dto: EditTaskDTO) {
    await this.getOneByIdOrFail(id);
    try {
      return await this.taskRepo.update(id, dto);
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException();
    }
  }

  async remove(id: number) {
    await this.getOneByIdOrFail(id);
    try {
      return await this.taskRepo.update(id, { isDeleted: id });
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException();
    }
  }

  async removeTask(projectId: number, code: string): Promise<HandleTaskRO> {
    const checkTask = await this.getOneByCodeOrFail(code);
    await this.taskRepo.isExistTaskCode(code, projectId);
    try {
      checkTask.projectId = null;
      await this.taskRepo.update(checkTask.id, checkTask);
      return this.handleTaskResponse(checkTask);
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException();
    }
  }

  async getAllTaskByIdProject(projectId: number): Promise<GetTaskRO[]> {
    try {
      const oldArray = await this.taskRepo.getAllTaskByIdProject(projectId);
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
