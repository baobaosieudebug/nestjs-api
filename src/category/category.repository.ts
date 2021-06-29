import { EntityRepository, Repository } from 'typeorm';
import { CategoryEntity } from './category.entity';

@EntityRepository(CategoryEntity)
export class CategoryRepository extends Repository<CategoryEntity> {
  getAll(projectId: number) {
    return this.find({ projectId, isDeleted: 0 });
  }

  getById(id: number, projectId: number) {
    return this.findOne({ id, projectId, isDeleted: 0 });
  }

  getByCode(code: string, projectId: number) {
    return this.findOne({ code, projectId, isDeleted: 0 });
  }

  async isCategoryExistCode(code: string, projectId: number): Promise<boolean> {
    const checkExist = await this.count({
      where: { code, projectId, isDeleted: 0 },
    });
    return checkExist > 0;
  }
}
