import { EntityRepository, Repository } from 'typeorm';
import { StatusEntity } from './status.entity';

@EntityRepository(StatusEntity)
export class StatusRepository extends Repository<StatusEntity> {
  getAll(projectId: number) {
    return this.find({ projectId, isDeleted: 0 });
  }

  getById(id: number, projectId: number) {
    return this.findOne({ id, projectId, isDeleted: 0 });
  }

  getByCode(code: string, projectId: number) {
    return this.findOne({ code, projectId, isDeleted: 0 });
  }

  async isStatusExistCode(code: string, projectId: number): Promise<boolean> {
    const checkExist = await this.count({
      where: { code, projectId, isDeleted: 0 },
    });
    return checkExist > 0;
  }

  async isStatusExistId(id: number, projectId: number): Promise<boolean> {
    const checkExist = await this.count({
      where: { id, projectId, isDeleted: 0 },
    });
    return checkExist > 0;
  }
}
