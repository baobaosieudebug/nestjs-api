import { UsersEntity } from './users.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(UsersEntity)
export class UserRepository extends Repository<UsersEntity> {
  getOneById(id) {
    return this.findOne({ id, isDeleted: 0 });
  }

  async getOneByEmail(email: string) {
    return this.findOne({ email, isDeleted: 0 });
  }

  getAll() {
    return this.find({ isDeleted: 0 });
  }

  getOneAndGroupRelation(id) {
    return this.findOne({ id, isDeleted: 0 }, { relations: ['groups'] });
  }

  async getAllUserByIdProject(projectId: number) {
    return await this.createQueryBuilder('user')
      .leftJoinAndSelect('user.projects', 'project')
      .where('project.id = :projectId', { projectId })
      .getMany();
  }

  async getAllUserByIdGroup(idGroup: number) {
    return await this.createQueryBuilder('user')
      .leftJoinAndSelect('user.groups', 'group')
      .where('group.id = :idGroup', { idGroup })
      .getMany();
  }
}
