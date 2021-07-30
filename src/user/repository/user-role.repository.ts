import { EntityRepository, Repository } from 'typeorm';
import { UserRoleEntity } from '../entities/user-role.entity';

@EntityRepository(UserRoleEntity)
export class UserRoleRepository extends Repository<UserRoleEntity> {
  async getListAdmin(roleId: number) {
    return await this.find({ where: { roleId } });
  }

  async getRoleById(userId: number) {
    const entity = await this.findOne({ where: { userId } });
    return entity;
  }
}
