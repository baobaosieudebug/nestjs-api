import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { TaskRepository } from './task.respository';
import { AddTaskDTO } from './dto/add-task.dto';
import { EditTaskDTO } from './dto/edit-task.dto';

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

  async addTaskInProject(code: string, projectId: number) {
    const task = await this.getOneByCodeOrFail(code);
    await this.checkExistCode(code, projectId);
    try {
      return await this.taskRepo.update(task.id, { projectId: projectId });
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

  async removeTask(projectId: number, code: string) {
    const checkTask = await this.getOneByCodeOrFail(code);
    await this.taskRepo.isExistTaskCode(code, projectId);
    try {
      return await this.taskRepo.update(checkTask.id, { projectId: null });
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException();
    }
  }

  async getAllTaskByIdProject(projectId: number) {
    try {
      return await this.taskRepo.getAllTaskByIdProject(projectId);
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException();
    }
  }
}
