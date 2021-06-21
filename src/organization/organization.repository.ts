import { OrganizationEntity } from './organization.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(OrganizationEntity)
export class OrganizationRepository extends Repository<OrganizationEntity> {
  getById(id) {
    return this.findOne({ id }, { relations: ['projects'] });
  }

  // getByIdWithDelete(id) {
  //   return this.findOne({ id }, { withDeleted: true });
  // }

  getAllOrganization() {
    return this.find();
  }

  getByCodeId(code) {
    return this.findOne({ code }, { relations: ['projects'] });
  }
}
