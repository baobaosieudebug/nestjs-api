import { Injectable } from '@nestjs/common';
import { CategoryRepository } from './category.repository';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepo: CategoryRepository) {}

  async getAll(projectId: number) {
    return await this.categoryRepo.find({ projectId: projectId });
  }

  async getOneById(id: number) {
    return await this.categoryRepo.findOne(id);
  }
}
