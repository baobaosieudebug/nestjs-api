import { EntityRepository, Repository } from 'typeorm';
import { Type } from './type.entity';

@EntityRepository(Type)
export class TypeRepository extends Repository<Type> {
  getById(id) {
    return this.findOne({ id });
  }

  getAll() {
    return this.find();
  }
}
