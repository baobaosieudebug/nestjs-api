import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { TaskRepository } from './task.respository';
import { AddTaskDTO } from './dto/add-task.dto';
import { EditTaskDTO } from './dto/edit-task.dto';
import { UsersEntity } from '../user/users.entity';

@Injectable()
export class TaskService {
  constructor(private taskRepo: TaskRepository) {}

  async getOneById(id: number) {
    return await this.taskRepo.getById(id);
  }

  async getOneByIdOrFail(id: number) {
    if ((await this.getOneById(id)) == null) {
      throw new NotFoundException();
    } else {
      return await this.getOneById(id);
    }
  }

  async getOneByCode(code: string) {
    return await this.taskRepo.getByCode(code);
  }

  async getOneByCodeOrFail(code: string) {
    const response = await this.getOneByCode(code);
    if (!response) {
      throw new NotFoundException();
    }
    return response;
  }

  async getAll() {
    return await this.taskRepo.getAll();
  }

  async checkTask(code: string) {
    const task = await this.getOneByCodeOrFail(code);
    if (!task) {
      return null;
    }
    return task;
  }

  async checkTaskID(id: number) {
    const task = await this.getOneByIdOrFail(id);
    if (!task) {
      return null;
    }
    return task;
  }

  async create(dto: AddTaskDTO) {
    try {
      const task = this.taskRepo.create(dto);
      task.createdAt = new Date();
      return await this.taskRepo.save(task);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async addTask(code: string, user: UsersEntity) {
    const checkTask = await this.checkTask(code);
    if (!checkTask) {
      throw new NotFoundException();
    }
    try {
      checkTask.user = user;
      return this.taskRepo.save(checkTask);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async addTaskInProject(code: string, idProject: number) {
    const checkTask = await this.checkTask(code);
    if (!checkTask) {
      throw new NotFoundException();
    }
    const existTask = await this.taskRepo.isTaskExistInProject(idProject, code);
    if (existTask) {
      throw new NotFoundException('Task exist in Project');
    }
    try {
      return await this.taskRepo.update(checkTask.id, { projectID: idProject });
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async assignTask(code: string, user: UsersEntity) {
    const checkTask = await this.checkTask(code);
    if (!checkTask) {
      throw new NotFoundException();
    }
    try {
      checkTask.userAssign = user;
      return this.taskRepo.save(checkTask);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
  async edit(id: number, dto: EditTaskDTO) {
    const checkTask = this.checkTaskID(id);
    if (!checkTask) {
      throw new NotFoundException();
    }
    try {
      return await this.taskRepo.update(id, dto);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async remove(id: number) {
    const checkTask = this.checkTaskID(id);
    if (!checkTask) {
      throw new NotFoundException();
    }
    try {
      const task = this.getOneById(id);
      (await task).isDeleted = (await task).id;
      return this.taskRepo.save(await task);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
}
