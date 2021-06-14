import { OrganizationEntity } from 'src/organizations/organization.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(OrganizationEntity)
export class OrganizationRepository extends Repository<OrganizationEntity> {
  getById(id) {
    return this.findOne({ id });
  }

  getAllOrganization() {
    return this.find();
  }

  getByCodeId(codeId) {
    return this.findOne({ codeId });
  }
}
