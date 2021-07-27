import { UserEntity } from '../entities/user.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
  getOneByUsername(username: string) {
    return this.findOne({ username, isDeleted: 0 });
  }

  getOneById(id: number) {
    return this.findOne({ id, isDeleted: 0 });
  }

  getOneByEmail(email: string) {
    return this.findOne({ email, isDeleted: 0 }, { relations: ['organization'] });
  }

  async isExistEmail(email: string): Promise<boolean> {
    const checkExist = await this.count({
      where: { email, isDeleted: 0 },
    });
    return checkExist > 0;
  }

  async isExistUsername(username: string): Promise<boolean> {
    const checkExist = await this.count({
      where: { username, isDeleted: 0 },
    });
    return checkExist > 0;
  }

  async isExistCode(code: string): Promise<boolean> {
    const checkExist = await this.count({
      where: { code, isDeleted: 0 },
    });
    return checkExist > 0;
  }
}
