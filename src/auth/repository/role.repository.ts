import { EntityRepository, Repository } from 'typeorm';
import { RoleEntity } from '../entities/role.entity';

@EntityRepository(RoleEntity)
export class RoleRepository extends Repository<RoleEntity> {
  async getIdOfRoleByCode(code: string) {
    const role = await this.findOne({ where: { code } });
    return role.id;
  }
}
