import { ProjectEntity } from './project.entity';
import { EntityRepository, Not, Repository } from 'typeorm';

@EntityRepository(ProjectEntity)
export class ProjectRepository extends Repository<ProjectEntity> {
  getById(id) {
    return this.findOne({ id, isDeleted: 0 });
  }

  getAll(organizationId: number) {
    return this.find({ organizationId, isDeleted: 0 });
  }

  getByCode(code) {
    return this.findOne({ code, isDeleted: 0 });
  }

  async checkProjectExist(id: number) {
    const project = await this.count({ where: { id } });
    return project > 0;
  }

  async isProjectExist(organizationId: number, code: string) {
    const project = await this.count({
      where: { code, organizationId },
    });
    return project > 0;
  }

  async isOwner(code: string, createById: number) {
    const project = await this.count({ where: { code, createById } });
    return project > 0;
  }

  async isExistCode(id: number, code: string) {
    const project = await this.count({ where: { id: Not(id), code } });
    return project > 0;
  }

  // async isUserExist(idUser: number) {
  //   const project = await this.createQueryBuilder('project')
  //     .leftJoinAndSelect('project.users', 'user')
  //     .where('user.id = :idUser', { idUser })
  //     .getCount();
  //   return project > 0;
  // }

  // async removeUserInProject(idUser: number, id: number) {
  //   return this.createQueryBuilder('project').relation(UserEntity, 'projects').of(idUser).remove(id);
  // }
}
