import { EntityRepository, Repository } from 'typeorm';
import { Category } from './category.entity';

@EntityRepository(Category)
export class CategoryRepository extends Repository<Category> {
  getById(id) {
    return this.findOne({ id });
  }

  getAll() {
    return this.find();
  }

}
