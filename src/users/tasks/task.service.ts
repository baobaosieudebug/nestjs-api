import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AddTaskDTO } from 'src/dto/add-task.dto';
import { EditTaskDTO } from 'src/dto/edit-task.dto';
import { GroupRepository } from 'src/repo/group.repository';
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
    const taskRO = new GetTaskRO();
    taskRO.name = (await task).name;
    taskRO.codeId = (await task).codeId;
    taskRO.user = (await task).user;
    taskRO.group = (await task).group;
    return taskRO;
  }

  async getOneById(id: number) {
    return await this.taskRepo.getById(id);
  }

  async getOneByIdOrFail(id: number) {
    if ((await this.getOneById(id)) == null) {
      throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
    } else {
      const response = await this.getOneById(id);
      return response;
    }
  }

  async getAllTask() {
    return await this.taskRepo.getAllTask();
  }

  async getAllTaskByIdGroup(idGroup) {
    return this.taskRepo.getAllTaskByIdGroup(idGroup);
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

  async softDelte(id: number) {
    const task = this.taskRepo.getById(id);
    (await task).isDelete = (await task).codeId;
    this.taskRepo.save(await task);
    return new HttpException('Delete Successfully!', HttpStatus.OK);
  }
  async removeTask(id: number) {
    const task = this.getOneByIdOrFail(id);
    await this.taskRepo.delete((await task).id);
    return new HttpException('Delete Successfully!', HttpStatus.OK);
  }
}
