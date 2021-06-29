import { EntityRepository, Repository } from 'typeorm';
import { CategoryEntity } from './category.entity';

@EntityRepository(CategoryEntity)
export class CategoryRepository extends Repository<CategoryEntity> {
  getAll(projectId: number) {
    return this.find({ projectId, isDeleted: null });
  }

  getById(id: number, projectId: number) {
    return this.findOne({ id, projectId, isDeleted: null });
  }

  getByCode(code: string, projectId: number) {
    return this.findOne({ code, projectId, isDeleted: null });
  }

  async isCategoryExistCode(code: string, projectId: number): Promise<boolean> {
    const checkExist = await this.count({
      where: { code, projectId, isDeleted: null },
    });
    return checkExist > 0;
  }
}
