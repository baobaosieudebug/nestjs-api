import { OrganizationEntity } from '../organization/organization.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(OrganizationEntity)
export class OrganizationRepository extends Repository<OrganizationEntity> {
  getById(id) {
    return this.findOne({ id }, { relations: ['projects'] });
  }

  async getByIdWithDelete(id) {
    return this.findOne({ id }, { withDeleted: true });
  }
  getAllOrganization() {
    return this.find();
  }

  getByCodeId(codeId) {
    return this.findOne({ codeId });
  }
}
