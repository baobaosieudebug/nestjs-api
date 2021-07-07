import { OrganizationEntity } from './organization.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(OrganizationEntity)
export class OrganizationRepository extends Repository<OrganizationEntity> {
  getByCode(code: string) {
    return this.findOne({ code, isDeleted: 0 });
  }

  async isOrgExistCode(code: string): Promise<boolean> {
    const checkExist = await this.count({
      where: { code, isDeleted: 0 },
    });
    return checkExist > 0;
  }

  async isOwnerOrg(code: string, ownerId: number): Promise<boolean> {
    const checkExist = await this.count({
      where: { code, ownerId, isDeleted: 0 },
    });
    return checkExist > 0;
  }

  async isExistOwner(ownerId: number): Promise<boolean> {
    const checkExist = await this.count({
      where: { ownerId, isDeleted: 0 },
    });
    return checkExist > 0;
  }

  async getOneAndUserRelation(code: string) {
    return this.findOne({ code, isDeleted: 0 }, { relations: ['users'] });
  }
}
