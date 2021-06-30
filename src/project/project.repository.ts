import { ProjectEntity } from './project.entity';
import { EntityRepository, Repository } from 'typeorm';
import { UsersEntity } from '../user/users.entity';

@EntityRepository(ProjectEntity)
export class ProjectRepository extends Repository<ProjectEntity> {
  getById(id) {
    return this.findOne({ id, isDeleted: 0 });
  }

  getAll() {
    return this.find({ isDeleted: 0 });
  }

  getByCode(code) {
    return this.findOne({ code, isDeleted: 0 });
  }

  getProjectByIdOrg(orgId: number) {
    return this.find({ organizationId: orgId, isDeleted: 0 });
  }

  getOneAndUserRelation(id) {
    return this.findOne({ id, isDeleted: 0 }, { relations: ['users'] });
  }

  async isProjectExist(orgId: number, code: string) {
    const entity = await this.count({
      where: { code, organizationId: orgId },
    });
    return entity > 0;
  }

  async isUserExist(idUser: number) {
    const response = await this.createQueryBuilder('project')
      .leftJoinAndSelect('project.users', 'user')
      .where('user.id = :idUser', { idUser })
      .getCount();
    return response > 0;
  }

  async removeUserInProject(idUser: number, id: number) {
    return this.createQueryBuilder('project')
      .relation(UsersEntity, 'projects')
      .of(idUser)
      .remove(id);
  }
}
