import { ProjectEntity } from './project.entity';
import { EntityRepository, Repository } from 'typeorm';
import { UsersEntity } from '../user/users.entity';
import { NotFoundException } from '@nestjs/common';

@EntityRepository(ProjectEntity)
export class ProjectRepository extends Repository<ProjectEntity> {
  getById(id) {
    return this.findOne({ id });
  }

  getAllProject() {
    return this.find();
  }

  getByCode(code) {
    return this.findOne({ code });
  }

  async getOneByIdOrFail(id: number) {
    const response = await this.getById(id);
    if (!response) {
      throw new NotFoundException('Project Not Found');
    }
    return response;
  }

  async getOneByCodeOrFail(code: string) {
    const response = await this.getByCode(code);
    if (!response) {
      throw new NotFoundException();
    }
    return response;
  }

  async getByIdWithDelete(id) {
    const entity = await this.count({ where: { id, isDeleted: id } });
    return entity > 0;
  }

  async isProjectExistInOrg(orgID: number, code: string) {
    const entity = await this.count({
      where: { code, organizationID: orgID },
    });
    return entity > 0;
  }

  async isUserExistInProject(idUser: number) {
    return await this.createQueryBuilder('project')
      .leftJoinAndSelect('project.users', 'user')
      .where('user.id = :idUser', { idUser })
      .getCount();
  }

  async removeUserInProject(idUser: number, id: number) {
    return this.createQueryBuilder('project')
      .relation(UsersEntity, 'projects')
      .of(idUser)
      .remove(id);
  }

  async getAllProjectByIDOrg(idOrg: number) {
    return this.find({ organizationID: idOrg });
  }
}
