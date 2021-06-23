import { UsersEntity } from './users.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(UsersEntity)
export class UserRepository extends Repository<UsersEntity> {
  getOneById(id) {
    return this.findOne(
      { id },
      { relations: ['groups', 'tasks', 'projects', 'tasksAssign'] },
    );
  }

  getOneByEmail(email) {
    return this.findOne(
      { email },
      { relations: ['groups', 'tasks', 'projects', 'tasksAssign'] },
    );
  }

  getAll() {
    return this.find({ relations: ['groups', 'tasks'] });
  }

  getByIdWithDelete(id) {
    return this.count({ where: { id, isDeleted: id } });
  }

  async isUserExistInProject(projectID: number, id: number) {
    const entity = await this.count({
      where: { id, projectID: projectID },
    });
    return entity > 0;
  }
}
