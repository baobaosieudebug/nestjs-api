import { EntityRepository, Repository } from 'typeorm';
import { CategoryEntity } from './category.entity';

@EntityRepository(CategoryEntity)
export class CategoryRepository extends Repository<CategoryEntity> {
  getAll(idProject: number) {
    return this.find({ projectId: idProject, isDeleted: null });
  }

  getById(id: number, projectId: number) {
    return this.findOne({ id, projectId, isDeleted: null });
  }

  getByCode(code: string, idProject: number) {
    return this.findOne({ code, projectId: idProject, isDeleted: null });
  }

  async isCategoryExistCode(code: string, projectId: number): Promise<boolean> {
    const checkExist = await this.count({
      where: { code, projectId, isDeleted: null },
    });
    return checkExist > 0;
  }

  async isCategoryExistId(id: number, projectId: number): Promise<boolean> {
    const checkExist = await this.count({
      where: { id, projectId, isDeleted: null },
    });
    return checkExist > 0;
  }
}
