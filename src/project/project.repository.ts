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

  async checkProjectExist(id: number) {
    const project = await this.count({ where: { id } });
    return project > 0;
  }

  async isProjectExist(orgId: number, code: string) {
    const project = await this.count({
      where: { code, organizationId: orgId },
    });
    return project > 0;
  }

  async isUserExist(idUser: number) {
    const project = await this.createQueryBuilder('project')
      .leftJoinAndSelect('project.users', 'user')
      .where('user.id = :idUser', { idUser })
      .getCount();
    return project > 0;
  }

  async removeUserInProject(idUser: number, id: number) {
    return this.createQueryBuilder('project')
      .relation(UsersEntity, 'projects')
      .of(idUser)
      .remove(id);
  }
}
