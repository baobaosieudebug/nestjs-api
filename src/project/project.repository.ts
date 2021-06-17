import { ProjectEntity } from '../project/project.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(ProjectEntity)
export class ProjectRepository extends Repository<ProjectEntity> {
  getById(id) {
    return this.findOne({ id }, { relations: ['organization', 'users'] });
  }

  getAllProject() {
    return this.find();
  }

  getByCodeId(codeId) {
    return this.findOne({ codeId }, { relations: ['organization', 'users'] });
  }
}
