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

  async isTypeExistCode(
    id: number,
    code: string,
    projectId: number,
  ): Promise<boolean> {
    const checkExist = await this.count({
      where: { id: Not(id), code, projectId, isDeleted: 0 },
    });
    return checkExist > 0;
  }
}
