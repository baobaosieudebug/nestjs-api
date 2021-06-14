import { NotFoundException } from '@nestjs/common';
import { GetTaskRO } from 'src/ro/get-task.ro';
import { TaskEntity } from 'src/users/tasks/task.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(TaskEntity)
export class TaskRepository extends Repository<TaskEntity> {
  async getById(id) {
    const task = this.findOne({ id }, { relations: ['user', 'group'] });
    if ((await task).isDelete == null) {
      return task;
    } else {
      throw new NotFoundException('Task ID Not Found');
    }
  }

  getAllTask() {
    return this.find();
  }

  getByCodeId(codeId) {
    return this.findOne({ codeId });
  }

  getAllTaskByIdGroup(id) {
    return this.findOne({ id }, { relations: ['tasks'] });
  }
}
