import { TaskEntity } from 'src/users/tasks/task.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(TaskEntity)
export class TaskRepository extends Repository<TaskEntity> {
  getById(id) {
    return this.findOne({ id });
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
