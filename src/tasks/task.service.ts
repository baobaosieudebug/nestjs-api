import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AddTaskDTO } from 'src/dto/add-task.dto';
import { EditTaskDTO } from 'src/dto/edit-task.dto';
import { GroupRepository } from 'src/group/repo/group.repository';
import { TaskRepository } from 'src/repo/task.respository';
import { UserRepository } from 'src/repo/user.repository';
import { GetTaskRO } from 'src/ro/get-task.ro';
import { getCustomRepository } from 'typeorm';

@Injectable()
export class TaskService {
  constructor(private readonly taskRepo: TaskRepository) {}

  userRepo = getCustomRepository(UserRepository);
  groupRepo = getCustomRepository(GroupRepository);

  async getOneByIdForUser(id: number) {
    const task = await this.taskRepo.getById(id);
    if (!task) {
      throw new NotFoundException('Task ID Not Found');
    } else {
      const taskRO = new GetTaskRO();
      taskRO.name = (await task).name;
      taskRO.codeId = (await task).codeId;
      taskRO.user = (await task).user;
      taskRO.group = (await task).group;
      return taskRO;
    }
  }

  async getOneById(id: number) {
    return await this.taskRepo.getById(id);
  }

  async getOneByIdOrFail(id: number) {
    if ((await this.getOneById(id)) == null) {
      throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
    } else {
      const task = await this.getOneById(id);
      return task;
    }
  }

  async getOneByIdOrFailForUser(id: number) {
    if ((await this.getOneById(id)) == null) {
      throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
    } else {
      const task = await this.getOneById(id);
      const taskRO = new GetTaskRO();
      taskRO.name = (await task).name;
      taskRO.codeId = (await task).codeId;
      taskRO.user = (await task).user;
      taskRO.group = (await task).group;
      return taskRO;
    }
  }

  async getAllTask() {
    return await this.taskRepo.getAllTask();
  }

  async getAllTaskByIdGroup(idGroup: number) {
    return this.taskRepo.getAllTaskByIdGroup(idGroup);
  }

  async getOneByCodeId(codeId: number) {
    return await this.taskRepo.getByCodeId(codeId);
  }

  async getOneTaskByCodeIdOrFail(codeId: number) {
    if ((await this.getOneByCodeId(codeId)) == null) {
      throw new HttpException('Task Not Found', HttpStatus.NOT_FOUND);
    } else {
      const task = await this.getOneByCodeId(codeId);
      const taskRO = new GetTaskRO();
      taskRO.name = (await task).name;
      taskRO.codeId = (await task).codeId;
      taskRO.user = (await task).user;
      taskRO.group = (await task).group;
      return taskRO;
    }
  }

  async restoreTask(id: number) {
    const task = this.taskRepo.getByIdWithDelete(id);
    await this.taskRepo.restore(await task);
    return new HttpException('Restore Successfully!', HttpStatus.OK);
  }

  async createTask(task: AddTaskDTO) {
    const newTask = await this.taskRepo.create(task);
    await this.taskRepo.save(newTask);
    return new HttpException('Create Task Success', HttpStatus.CREATED);
  }

  async editTask(task: EditTaskDTO) {
    const findTask = this.taskRepo.getByCodeId(task.codeId);
    await this.taskRepo.update((await findTask).id, task);
  }

  async softDelete(id: number) {
    const task = this.getOneByIdOrFail(id);
    await this.taskRepo.softDelete(await task);
    return new HttpException('Delete Successfully!', HttpStatus.OK);
  }

  async removeTask(id: number) {
    const task = this.getOneByIdOrFail(id);
    await this.taskRepo.delete((await task).id);
    return new HttpException('Delete Successfully!', HttpStatus.OK);
  }
}
