import { ProjectEntity } from './project.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(ProjectEntity)
export class ProjectRepository extends Repository<ProjectEntity> {
  getById(id) {
    return this.findOne(
      { id },
      { relations: ['organization', 'users', 'tasks'] },
    );
  }

  getAllProject() {
    return this.find();
  }

  getByCode(code) {
    return this.findOne(
      { code },
      { relations: ['organization', 'users', 'tasks'] },
    );
  }

  getByIdWithDelete(id) {
    return this.findOne({ id }, { withDeleted: true });
  }

  async isProjectExistInOrg(orgID: number, code: string) {
    const entity = await this.count({
      where: { code, organizationID: orgID },
    });
    return entity > 0;
  }
}
