import { EntityRepository, Repository } from 'typeorm';
import { PermissionEntity } from '../entities/permission.entity';

@EntityRepository(PermissionEntity)
export class PermissionRepository extends Repository<PermissionEntity> {
  async isExistPer(actionId: number, resourceId: number, roleId: number) {
    const count = await this.count({ where: { resourceId, roleId, actionId } });
    return count > 0;
  }
}
