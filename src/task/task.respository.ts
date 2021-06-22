import { TaskEntity } from './task.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(TaskEntity)
export class TaskRepository extends Repository<TaskEntity> {
  async getById(id) {
    return this.findOne({ id }, { relations: ['user', 'project'] });
  }

  getAll() {
    return this.find({ isDeleted: null });
  }

  getByCode(code) {
    return this.findOne({ code }, { relations: ['user', 'project'] });
  }

  async isTaskExistInProject(projectID: number, code: string) {
    return await this.count({
      where: { code, projectID: projectID },
    });
  }
}
