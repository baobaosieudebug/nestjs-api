import { UsersEntity } from '../user/users.entity';
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
}
