import { EntityRepository, Repository } from 'typeorm';
import { VersionEntity } from './version.entity';

@EntityRepository(VersionEntity)
export class VersionRepository extends Repository<VersionEntity> {
  getAll(projectId: number) {
    return this.find({ projectId, isDeleted: null });
  }

  getById(id: number, projectId: number) {
    return this.findOne({ id, projectId, isDeleted: null });
  }

  getByCode(code: string, projectId: number) {
    return this.findOne({ code, projectId, isDeleted: null });
  }

  async isVersionExistCode(code: string, projectId: number): Promise<boolean> {
    const checkExist = await this.count({
      where: { code, projectId, isDeleted: null },
    });
    return checkExist > 0;
  }

  async isVersionExistId(id: number, projectId: number): Promise<boolean> {
    const checkExist = await this.count({
      where: { id, projectId, isDeleted: null },
    });
    return checkExist > 0;
  }
}
