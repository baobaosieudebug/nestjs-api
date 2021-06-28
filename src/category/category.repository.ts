import { EntityRepository, Repository } from 'typeorm';
import { CategoryEntity } from './category.entity';
import { NotFoundException } from '@nestjs/common';

@EntityRepository(CategoryEntity)
export class CategoryRepository extends Repository<CategoryEntity> {
  getAll(idProject: number) {
    return this.find({ projectId: idProject, isDeleted: null });
  }

  getById(id: number, idProject: number) {
    return this.findOne({ id, projectId: idProject, isDeleted: null });
  }

  getByCode(code: string) {
    return this.findOne({ code });
  }

  async getOneByIdOrFail(id: number, idProject: number) {
    const response = await this.getById(id, idProject);
    if (!response) {
      throw new NotFoundException();
    }
    return response;
  }

  async getOneByCodeOrFail(code: string) {
    const response = await this.getByCode(code);
    if (!response) {
      throw new NotFoundException();
    }
    return response;
  }

  async countCategoryInProjectByCode(code: string, idProject: number) {
    return (await this.count({ where: { code, projectId: idProject, isDeleted: null } })) > 0;
  }

  async countCategoryInProjectById(id: number, idProject: number) {
    return (await this.count({ where: { id, projectId: idProject, isDeleted: null } })) > 0;
  }
}
