import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { TaskRepository } from './task.respository';
import { AddTaskDTO } from './dto/add-task.dto';
import { EditTaskDTO } from './dto/edit-task.dto';
import { UsersEntity } from '../user/users.entity';
import { ProjectEntity } from '../project/project.entity';

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

  async getOneByCodeId(codeId: string) {
    return await this.taskRepo.getByCodeId(codeId);
  }

  async getOneByCodeIdOrFail(codeId: string) {
    const response = await this.getOneByCodeId(codeId);
    if (!response) {
      throw new NotFoundException();
    }
    return response;
  }

  async getAll() {
    return await this.taskRepo.getAll();
  }

  async checkTask(codeId: string) {
    const task = await this.getOneByCodeIdOrFail(codeId);
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

  async addTask(codeId: string, user: UsersEntity) {
    const checkTask = await this.checkTask(codeId);
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

  async addTaskInProject(codeId: string, project: ProjectEntity) {
    const checkTask = await this.checkTask(codeId);
    if (!checkTask) {
      throw new NotFoundException();
    }
    try {
      checkTask.project = project;
      return this.taskRepo.save(checkTask);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async assignTask(codeId: string, user: UsersEntity) {
    const checkTask = await this.checkTask(codeId);
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
      (await task).isDelete = (await task).id;
      return this.taskRepo.save(await task);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
}
