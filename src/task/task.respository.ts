import { TaskEntity } from './task.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(TaskEntity)
export class TaskRepository extends Repository<TaskEntity> {
  async getById(id) {
    return this.findOne({ id }, { relations: ['user'] });
  }

  // async getByIdWithDelete(id) {
  //   return this.findOne({ id }, { relations: ['user'], withDeleted: true });
  // }

  getAll() {
    return this.find({ isDelete: null });
  }

  getByCodeId(codeId) {
    return this.findOne({ codeId }, { relations: ['user'] });
  }

  // getAllTaskByIdGroup(id) {
  //   return this.findOne({ id }, { relations: ['tasks'] });
  // }
}
