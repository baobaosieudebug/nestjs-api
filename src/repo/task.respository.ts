import { NotFoundException } from '@nestjs/common';
import { GetTaskRO } from 'src/ro/get-task.ro';
import { TaskEntity } from 'src/users/tasks/task.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(TaskEntity)
export class TaskRepository extends Repository<TaskEntity> {
  async getById(id) {
    return this.findOne({ id }, { relations: ['user', 'group'] });
    // if ((await task).id ) {
    //   throw new NotFoundException('Task ID Not Found');
    // } else {
    //   return task;
    // }
    // if ((await task).deletedAt != null) {
    //   return task;
    // } else {
    //   throw new NotFoundException('Task ID Not Found');
    // }
  }

  getAllTask() {
    return this.find({ isDelete: null });
  }

  getByCodeId(codeId) {
    return this.findOne({ codeId });
  }

  getAllTaskByIdGroup(id) {
    return this.findOne({ id }, { relations: ['tasks'] });
  }
}
