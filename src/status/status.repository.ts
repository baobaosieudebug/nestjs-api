import { EntityRepository, Repository } from 'typeorm';
import { StatusEntity } from './status.entity';

@EntityRepository(StatusEntity)
export class StatusRepository extends Repository<StatusEntity> {
  getAll(projectId: number) {
    return this.find({ projectId, isDeleted: null });
  }

  getById(id: number, projectId: number) {
    return this.findOne({ id, projectId, isDeleted: null });
  }

  getByCode(code: string, projectId: number) {
    return this.findOne({ code, projectId, isDeleted: null });
  }

  async isStatusExistCode(code: string, projectId: number): Promise<boolean> {
    const checkExist = await this.count({
      where: { code, projectId, isDeleted: null },
    });
    return checkExist > 0;
  }

  async isStatusExistId(id: number, projectId: number): Promise<boolean> {
    const checkExist = await this.count({
      where: { id, projectId, isDeleted: null },
    });
    return checkExist > 0;
  }
}
