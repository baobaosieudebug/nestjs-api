import { OrganizationEntity } from './organization.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(OrganizationEntity)
export class OrganizationRepository extends Repository<OrganizationEntity> {
  getByCode(code: string) {
    return this.findOne({ code, isDeleted: 0 });
  }

  async isOrgCodeExist(code: string): Promise<boolean> {
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

  async isOwnerDomain(domain: string, ownerId: number): Promise<boolean> {
    const checkExist = await this.count({
      where: { domain, ownerId, isDeleted: 0 },
    });
    return checkExist > 0;
  }
}
