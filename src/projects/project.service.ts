import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AddTaskDTO } from 'src/dto/add-task.dto';
import { EditTaskDTO } from 'src/dto/edit-task.dto';
import { GroupRepository } from 'src/repo/group.repository';
import { UserRepository } from 'src/repo/user.repository';
import { getCustomRepository } from 'typeorm';
import { ProjectRepository } from 'src/repo/project.repository';

@Injectable()
export class ProjectService {
  constructor(private readonly projectRepo: ProjectRepository) {}

  //   userRepo = getCustomRepository(UserRepository);
  //   groupRepo = getCustomRepository(GroupRepository);

  //   async getOneById(id: number) {
  //     return await this.taskRepo.getById(id);
  //   }

  //   async getOneByIdOrFail(id: number) {
  //     if ((await this.getOneById(id)) == null) {
  //       throw new HttpException('Task not found', HttpStatus.NOT_FOUND);
  //     } else {
  //       const response = await this.getOneById(id);
  //       return response;
  //     }
  //   }

  async getAllTask() {
    return await this.projectRepo.getById(1);
    }

  //   async getAllTaskByIdGroup(idGroup) {
  //     return this.taskRepo.getAllTaskByIdGroup(idGroup);
  //   }
  //   async createTask(task: AddTaskDTO) {
  //     const newTask = await this.taskRepo.create(task);
  //     return await this.taskRepo.save(newTask);
  //   }

  //   async editTask(task: EditTaskDTO) {
  //     const findTask = this.taskRepo.getByCodeId(task.codeId);
  //     await this.taskRepo.update((await findTask).id, task);
  //   }

  //   async removeTask(id: number) {
  //     const user = this.getOneByIdOrFail(id);
  //     await this.taskRepo.delete((await user).id);
  //     return new HttpException('Delete Successfully!', HttpStatus.OK);
  //   }
}
