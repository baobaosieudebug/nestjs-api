import { EntityRepository, Repository } from 'typeorm';
import { Type } from './type.entity';

@EntityRepository(Type)
export class TypeRepository extends Repository<Type> {}
