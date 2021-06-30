import { GroupsEntity } from './group.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(GroupsEntity)
export class GroupRepository extends Repository<GroupsEntity> {
  getOneById(id) {
    return this.findOne({ id, isDeleted: 0 });
  }

  getAll() {
    return this.find({ isDeleted: 0 });
  }

  async isUserExistInGroup(idUser: number) {
    const response = await this.createQueryBuilder('group')
      .leftJoinAndSelect('group.users', 'user')
      .where('user.id = :idUser', { idUser })
      .getCount();
    return response > 0;
  }
}
