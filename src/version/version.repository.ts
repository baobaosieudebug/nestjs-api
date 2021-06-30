import { EntityRepository, Repository } from 'typeorm';
import { VersionEntity } from './version.entity';

@EntityRepository(VersionEntity)
export class VersionRepository extends Repository<VersionEntity> {
  getAll(projectId: number) {
    return this.find({ projectId, isDeleted: 0 });
  }

  getById(id: number, projectId: number) {
    return this.findOne({ id, projectId, isDeleted: 0 });
  }

  getByCode(code: string, projectId: number) {
    return this.findOne({ code, projectId, isDeleted: 0 });
  }

  async isVersionExistCode(code: string, projectId: number): Promise<boolean> {
    const checkExist = await this.count({
      where: { code, projectId, isDeleted: 0 },
    });
    return checkExist > 0;
  }
}
