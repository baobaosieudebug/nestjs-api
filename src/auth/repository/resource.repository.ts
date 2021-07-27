import { EntityRepository, Repository } from 'typeorm';
import { ResourceEntity } from '../entities/resource.entity';

@EntityRepository(ResourceEntity)
export class ResourceRepository extends Repository<ResourceEntity> {
  async getIdByCode(code: string) {
    const resource= await this.findOne({ code });
    return resource.id;
  }
}
