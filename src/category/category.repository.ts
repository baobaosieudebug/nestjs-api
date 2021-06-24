import { EntityRepository, Repository } from 'typeorm';
import { Category } from './category.entity';
import { NotFoundException } from '@nestjs/common';

@EntityRepository(Category)
export class CategoryRepository extends Repository<Category> {
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

  getAll(id) {
    return this.find({ projectID: id });
  }

  async countCategoryInProject(id: number, idProject: number) {
    return await this.count({ where: { id, projectID: idProject } });
  }
}
