import { EntityRepository, Repository } from 'typeorm';
import { CategoryEntity } from './category.entity';
import { NotFoundException } from '@nestjs/common';

@EntityRepository(CategoryEntity)
export class CategoryRepository extends Repository<CategoryEntity> {
  getById(id) {
    return this.findOne({ id });
  }

  async getOneByIdOrFail(id: number) {
    const response = await this.getById(id);
    if (!response) {
      throw new NotFoundException();
    }
    return response;
  }

  getAll() {
    return this.find();
  }

  async countCategoryInProject(id: number, idProject: number) {
    return await this.count({ where: { id, projectID: idProject } });
  }
}
