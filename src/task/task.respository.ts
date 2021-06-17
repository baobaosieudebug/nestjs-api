import { TaskEntity } from './task.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(TaskEntity)
export class TaskRepository extends Repository<TaskEntity> {
  async getById(id) {
    return this.findOne({ id }, { relations: ['user'] });
  }

  getAll() {
    return this.find({ isDelete: null });
  }

  getByCodeId(codeId) {
    return this.findOne({ codeId }, { relations: ['user'] });
  }
}
