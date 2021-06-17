import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { TaskRepository } from './task.respository';
import { AddTaskDTO } from './dto/add-task.dto';
import { EditTaskDTO } from './dto/edit-task.dto';
import { UsersEntity } from 'src/user/users.entity';

@Injectable()
export class TaskService {
  constructor(private taskRepo: TaskRepository) {}

  async getOneById(id: number) {
    return await this.taskRepo.getById(id);
  }

  async getOneByIdOrFail(id: number) {
    if ((await this.getOneById(id)) == null) {
      throw new NotFoundException('ID Incorrect');
    } else {
      const response = await this.getOneById(id);
      return response;
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

  async checkTask(codeId: string): Promise<boolean> {
    const task = await this.taskRepo.getByCodeId(codeId);
    if (!task) {
      return false;
    }
    return true;
  }

  async checkTaskID(id: number): Promise<boolean> {
    const task = await this.taskRepo.getById(id);
    if (!task) {
      return false;
    }
    return true;
  }

  async create(dto: AddTaskDTO) {
    try {
      const task = this.taskRepo.create(dto);
      return await this.taskRepo.save(task);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async addTask(codeId: string, user: UsersEntity) {
    const checkTask = this.checkTask(codeId);
    if ((await checkTask) == false) {
      throw new NotFoundException();
    }
    const task = this.getOneByCodeId(codeId);
    (await task).user = user;
    return this.taskRepo.save(await task);
  }

  async edit(id: number, dto: EditTaskDTO) {
    const checkTask = this.checkTaskID(id);
    if ((await checkTask) == false) {
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
    if ((await checkTask) == false) {
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
