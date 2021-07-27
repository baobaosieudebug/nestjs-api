import { TaskEntity } from './task.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(TaskEntity)
export class TaskRepository extends Repository<TaskEntity> {
  async getById(id: number) {
    return this.findOne({ id });
  }

  getAll(projectId: number) {
    return this.find({ projectId, isDeleted: 0 });
  }

  getByCode(code: string) {
    return this.findOne({ code });
  }

  async isExistTaskCode(code: string, projectId: number): Promise<boolean> {
    const entity = await this.count({
      where: { code, projectId },
    });
    return entity > 0;
  }
}
