import { EntityRepository, Repository } from 'typeorm';
import { TypeEntity } from './type.entity';

@EntityRepository(TypeEntity)
export class TypeRepository extends Repository<TypeEntity> {
  getAll(projectId: number) {
    return this.find({ projectId, isDeleted: null });
  }

  getById(id: number, projectId: number) {
    return this.findOne({ id, projectId, isDeleted: null });
  }

  getByCode(code: string, projectId: number) {
    return this.findOne({ code, projectId, isDeleted: null });
  }

  async isTypeExistCode(code: string, projectId: number): Promise<boolean> {
    const checkExist = await this.count({
      where: { code, projectId, isDeleted: null },
    });
    return checkExist > 0;
  }

  async isTypeExistId(id: number, projectId: number): Promise<boolean> {
    const checkExist = await this.count({
      where: { id, projectId, isDeleted: null },
    });
    return checkExist > 0;
  }
}
