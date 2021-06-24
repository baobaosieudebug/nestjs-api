import { GroupsEntity } from './group.entity';
import { EntityRepository, Repository } from 'typeorm';
import { UsersEntity } from '../user/users.entity';
import { NotFoundException } from '@nestjs/common';

@EntityRepository(GroupsEntity)
export class GroupRepository extends Repository<GroupsEntity> {
  getOneById(id) {
    return this.findOne({ id });
  }

  getAll() {
    return this.find();
  }

  getByName(name: string) {
    return this.count({ where: { nameGroup: name } });
  }

  async getOneByIdOrFail(id: number) {
    const response = await this.getOneById(id);
    if (!response) {
      throw new NotFoundException();
    }
    return response;
  }

  async isUserExistInGroup(idUser: number) {
    return await this.createQueryBuilder('group')
      .leftJoinAndSelect('group.users', 'user')
      .where('user.id = :idUser', { idUser })
      .getCount();
  }

  async removeUserInGroup(idUser: number, id: number) {
    return this.createQueryBuilder('group')
      .relation(UsersEntity, 'groups')
      .of(idUser)
      .remove(id);
  }
}
