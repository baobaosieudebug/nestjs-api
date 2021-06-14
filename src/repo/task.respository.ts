import { NotFoundException } from '@nestjs/common';
import { GetTaskRO } from 'src/ro/get-task.ro';
import { TaskEntity } from 'src/users/tasks/task.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(TaskEntity)
export class TaskRepository extends Repository<TaskEntity> {
  async getById(id) {
    return this.findOne({ id }, { relations: ['user', 'group'] });
  }

  async getByIdWithDelete(id) {
    return this.findOne(
      { id },
      { relations: ['user', 'group'], withDeleted: true },
    );
  }

  getAllTask() {
    return this.find({ isDelete: null });
  }

  getByCodeId(codeId) {
    return this.findOne({ codeId }, { relations: ['user', 'group'] });
  }

  getAllTaskByIdGroup(id) {
    return this.findOne({ id }, { relations: ['tasks'] });
  }
}
