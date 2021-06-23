import { OrganizationEntity } from './organization.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(OrganizationEntity)
export class OrganizationRepository extends Repository<OrganizationEntity> {
  getById(id) {
    return this.findOne({ id }, { relations: ['projects'] });
  }

  async getByIdWithDelete(id) {
    const entity = await this.count({ where: { id, isDeleted: id } });
    return entity > 0;
  }

  getAllOrganization() {
    return this.find();
  }

  getByCode(code) {
    return this.findOne({ code }, { relations: ['projects'] });
  }
}
