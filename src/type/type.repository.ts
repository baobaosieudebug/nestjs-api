import { EntityRepository, Not, Repository } from 'typeorm';
import { TypeEntity } from './type.entity';

@EntityRepository(TypeEntity)
export class TypeRepository extends Repository<TypeEntity> {
  getAll(projectId: number) {
    return this.find({ projectId, isDeleted: 0 });
  }

  getById(id: number, projectId: number) {
    return this.findOne({ id, projectId, isDeleted: 0 });
  }

  getByCode(code: string, projectId: number) {
    return this.findOne({ code, projectId, isDeleted: 0 });
  }

  async countType(projectId: number, code: string, id: number = null) {
    const options: any = {
      where: { code, projectId, isDeleted: 0 },
    };
    if (id !== null) {
      options.where.id = Not(id);
    }
    return await this.count(options);
  }
}
