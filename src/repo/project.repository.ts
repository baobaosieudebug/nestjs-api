import { ProjectEntity } from 'src/projects/project.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(ProjectEntity)
export class ProjectRepository extends Repository<ProjectEntity> {
  getById(id) {
    return this.findOne({ id });
  }

  getAllProject() {
    return this.find();
  }

  getByCodeId(codeId) {
    return this.findOne({ codeId });
  }

  //   getAllTaskByIdGroup(id) {
  //     return this.findOne({ id }, { relations: ['tasks'] });
  //   }
}
