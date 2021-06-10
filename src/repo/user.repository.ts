import { UsersEntity } from 'src/users/users.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(UsersEntity)
export class UserRepository extends Repository<UsersEntity> {
  getById(id) {
    return this.findOne(
      { id },
      {
        relations: ['groups'],
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
}
