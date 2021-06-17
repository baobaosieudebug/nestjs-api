import { GroupsEntity } from '../group/group.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(GroupsEntity)
export class GroupRepository extends Repository<GroupsEntity> {
  getOneById(id) {
    return this.findOne({ id }, { relations: ['users'] });
  }

  getAll() {
    return this.find();
  }
}
