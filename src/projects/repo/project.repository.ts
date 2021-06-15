import { ProjectEntity } from 'src/projects/entity/project.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(ProjectEntity)
export class ProjectRepository extends Repository<ProjectEntity> {
  getById(id) {
    return this.findOne({ id }, { relations: ['organization'] });
  }

  getAllProject() {
    return this.find();
  }

  getByCodeId(codeId) {
    return this.findOne({ codeId }, { relations: ['organization'] });
  }
}
