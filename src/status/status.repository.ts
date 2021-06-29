import { EntityRepository, Repository } from 'typeorm';
import { StatusEntity } from './status.entity';

@EntityRepository(StatusEntity)
export class StatusRepository extends Repository<StatusEntity> {
  getAll(idProject: number) {
    return this.find({ projectId: idProject, isDeleted: null });
  }

  getById(id: number, idProject: number) {
    return this.findOne({ id, projectId: idProject, isDeleted: null });
  }

  getByCode(code: string, idProject: number) {
    return this.findOne({ code, projectId: idProject, isDeleted: null });
  }

  async countStatusInProjectByCode(code: string, idProject: number) {
    return (
      (await this.count({
        where: { code, projectId: idProject, isDeleted: null },
      })) > 0
    );
  }

  async countStatusInProjectById(id: number, idProject: number) {
    return (
      (await this.count({
        where: { id, projectId: idProject, isDeleted: null },
      })) > 0
    );
  }
}
