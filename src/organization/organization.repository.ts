import { OrganizationEntity } from './organization.entity';
import { EntityRepository, Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

@EntityRepository(OrganizationEntity)
export class OrganizationRepository extends Repository<OrganizationEntity> {
  getById(id) {
    return this.findOne({ id });
  }

  async getOneByIdOrFail(id: number) {
    const response = await this.getById(id);
    if (!response) {
      throw new NotFoundException();
    }
    return response;
  }

  async getByIdWithDelete(id) {
    const entity = await this.count({ where: { id, isDeleted: id } });
    return entity > 0;
  }

  getAllOrganization() {
    return this.find();
  }

  getByCode(code) {
    return this.findOne({ code });
  }

  async getOneByCodeOrFail(code: string) {
    const response = await this.getByCode(code);
    if (!response) {
      throw new NotFoundException();
    }
    return response;
  }
}
