import { ProjectEntity } from 'src/projects/project.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(ProjectEntity)
export class ProjectRepository extends Repository<ProjectEntity> {
  getById(id) {
    return this.findOne({ id }, { relations: ['groups'] });
  }

  getAllProject() {
    return this.find();
  }

  getByCodeId(codeId) {
    return this.findOne({ codeId }, { relations: ['groups', 'organization'] });
  }

  // getAllProjectByIdGroup(id) {
  //   return this.findOne({ id }, { relations: ['groups'] });
  // }
}
