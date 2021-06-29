import { EntityRepository, Repository } from 'typeorm';
import { VersionEntity } from './version.entity';

@EntityRepository(VersionEntity)
export class VersionRepository extends Repository<VersionEntity> {
  getAll(idProject: number) {
    return this.find({ projectId: idProject, isDeleted: null });
  }

  getById(id: number, idProject: number) {
    return this.findOne({ id, projectId: idProject, isDeleted: null });
  }

  getByCode(code: string, idProject: number) {
    return this.findOne({ code, projectId: idProject, isDeleted: null });
  }

  async countVersionInProjectByCode(code: string, idProject: number) {
    return (
      (await this.count({
        where: { code, projectId: idProject, isDeleted: null },
      })) > 0
    );
  }

  async countVersionInProjectById(id: number, idProject: number) {
    return (
      (await this.count({
        where: { id, projectId: idProject, isDeleted: null },
      })) > 0
    );
  }
}
