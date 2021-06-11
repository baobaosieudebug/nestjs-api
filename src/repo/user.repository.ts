import { UsersEntity } from 'src/users/users.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(UsersEntity)
export class UserRepository extends Repository<UsersEntity> {
  getById(id) {
    return this.findOne(
      { id },
      {
        relations: ['groups', 'tasks'],
      },
    );
  }

  getByEmail(email) {
    return this.findOne(
      { email },
      {
        relations: ['groups'],
      },
    );
  }

  getAllUser() {
    return this.find({ relations: ['groups'] });
  }

  getAllTask(id) {
    return this.findOne({ id }, { relations: ['tasks'] });
  }
}
