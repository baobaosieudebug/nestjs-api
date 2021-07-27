import { EntityRepository, Repository } from 'typeorm';
import { UserOrganizationEntity } from '../entities/user-organization.entity';

@EntityRepository(UserOrganizationEntity)
export class UserOrganizationRepository extends Repository<UserOrganizationEntity> {
  async isExistUser(userId: number, organizationId: number): Promise<boolean> {
    const checkExist = await this.count({
      where: { userId, organizationId },
    });
    return checkExist > 0;
  }

  async getListUser(organizationId: number) {
    return await this.find({ organizationId });
  }
}
