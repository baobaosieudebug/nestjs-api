import { UsersEntity } from './users.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(UsersEntity)
export class UserRepository extends Repository<UsersEntity> {
  getOneById(id) {
    return this.findOne({ id, isDeleted: 0 });
  }

  getAll() {
    return this.find({ isDeleted: 0 });
  }

  getOneAndGroupRelation(id) {
    return this.findOne({ id, isDeleted: 0 }, { relations: ['groups'] });
  }

  async isUserExistInProject(projectId: number, id: number) {
    const entity = await this.count({
      where: { id, projectId: projectId },
    });
    return entity > 0;
  }

  async getAllUserByIDProject(projectId: number) {
    return await this.createQueryBuilder('user')
      .leftJoinAndSelect('user.projects', 'project')
      .where('project.id = :projectId', { projectId })
      .getMany();
  }

  async getAllUserByIDGroup(idGroup: number) {
    return await this.createQueryBuilder('user')
      .leftJoinAndSelect('user.groups', 'group')
      .where('group.id = :idGroup', { idGroup })
      .getRawMany();
  }
}
