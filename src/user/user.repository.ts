import { UsersEntity } from './users.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(UsersEntity)
export class UserRepository extends Repository<UsersEntity> {
  getOneById(id) {
    return this.findOne({ id });
  }

  getOneByEmail(email) {
    return this.findOne({ email });
  }

  getAll() {
    return this.find();
  }

  async getByIdWithDelete(id) {
    const entity = await this.count({ where: { id, isDeleted: id } });
    return entity > 0;
  }

  async isUserExistInProject(projectID: number, id: number) {
    const entity = await this.count({
      where: { id, projectID: projectID },
    });
    return entity > 0;
  }

  async isUserExistInGroup(groupID: number, id: number) {
    const entity = await this.count({
      where: { id, groupID: groupID },
    });
    return entity > 0;
  }

  async getAllUserByIDProject(idProject: number) {
    return await this.createQueryBuilder('user')
      .leftJoinAndSelect('user.projects', 'project')
      .where('project.id = :idProject', { idProject })
      .getMany();
  }

  async getAllUserByIDGroup(idGroup: number) {
    return await this.createQueryBuilder('user')
      .leftJoinAndSelect('user.groups', 'group')
      .where('group.id = :idGroup', { idGroup })
      .getMany();
  }

  async isUserExist(idGroup: number) {
    return await this.createQueryBuilder('user')
      .leftJoinAndSelect('user.groups', 'group')
      .where('group.id = :idGroup', { idGroup })
      .getCount();
  }
}
