import { OrganizationEntity } from './organization.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(OrganizationEntity)
export class OrganizationRepository extends Repository<OrganizationEntity> {
  getAll() {
    return this.find({ isDeleted: 0 });
  }

  getById(id: number) {
    return this.findOne({ id, isDeleted: 0 });
  }

  getByCode(code: string) {
    return this.findOne({ code, isDeleted: 0 });
  }

  async isOrgExistCode(code: string): Promise<boolean> {
    const checkExist = await this.count({
      where: { code, isDeleted: 0 },
    });
    return checkExist > 0;
  }

  async isOrgExistId(id: number): Promise<boolean> {
    const checkExist = await this.count({
      where: { id, isDeleted: 0 },
    });
    return checkExist > 0;
  }
}
