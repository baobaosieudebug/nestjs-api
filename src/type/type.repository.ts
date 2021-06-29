import { EntityRepository, Repository } from 'typeorm';
import { TypeEntity } from './type.entity';

@EntityRepository(TypeEntity)
export class TypeRepository extends Repository<TypeEntity> {
  getAll(idProject: number) {
    return this.find({ projectId: idProject, isDeleted: null });
  }

  getById(id: number, idProject: number) {
    return this.findOne({ id, projectId: idProject, isDeleted: null });
  }

  getByCode(code: string, idProject: number) {
    return this.findOne({ code, projectId: idProject, isDeleted: null });
  }

  async countTypeInProjectByCode(code: string, idProject: number) {
    return (
      (await this.count({
        where: { code, projectId: idProject, isDeleted: null },
      })) > 0
    );
  }

  async countTypeInProjectById(id: number, idProject: number) {
    return (
      (await this.count({
        where: { id, projectId: idProject, isDeleted: null },
      })) > 0
    );
  }
}
