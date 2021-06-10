import { GroupsEntity } from 'src/group/group.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(GroupsEntity)
export class GroupRepository extends Repository<GroupsEntity> {
  getById(id) {
    return this.findOne(
      { id },
      {
        relations: ['users'],
      },
    );
  }

  getAllGroup() {
    return this.find({ relations: ['users'] });
  }
}
