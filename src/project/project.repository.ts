import { ProjectEntity } from '../project/project.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(ProjectEntity)
export class ProjectRepository extends Repository<ProjectEntity> {
  getById(id) {
    return this.findOne(
      { id },
      { relations: ['organization', 'users', 'tasks'] },
    );
  }
  getOneByCodeId(codeId) {
    return this.findOne({ codeId });
  }

  getAllProject() {
    return this.find();
  }

  getByCodeId(codeId) {
    return this.findOne(
      { codeId },
      { relations: ['organization', 'users', 'tasks'] },
    );
  }
}
