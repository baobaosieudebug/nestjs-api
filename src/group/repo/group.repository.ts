import { GroupsEntity } from 'src/group/entity/group.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(GroupsEntity)
export class GroupRepository extends Repository<GroupsEntity> {
  getById(id) {
    return this.findOne(
      { id },
      {
        relations: ['users', 'tasks', 'projects'],
      },
    );
  }

  getAllGroup() {
    return this.find({ relations: ['users'] });
  }

  getAllTask(id) {
    return this.findOne({ id }, { relations: ['tasks'] });
  }
}
