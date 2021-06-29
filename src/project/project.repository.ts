import { ProjectEntity } from './project.entity';
import { EntityRepository, Repository } from 'typeorm';
import { UsersEntity } from '../user/users.entity';

@EntityRepository(ProjectEntity)
export class ProjectRepository extends Repository<ProjectEntity> {
  getById(id) {
    return this.findOne({ id, isDeleted: null });
  }

  getAll() {
    return this.find({ isDeleted: null });
  }

  getByCode(code) {
    return this.findOne({ code, isDeleted: null });
  }

  async getAllProjectByIDOrg(idOrg: number) {
    return this.find({ organizationID: idOrg });
  }

  async isProjectExist(orgID: number, code: string) {
    const entity = await this.count({
      where: { code, organizationID: orgID },
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
