import { EntityRepository, Repository } from 'typeorm';
import { VersionEntity } from './version.entity';
import { NotFoundException } from '@nestjs/common';

@EntityRepository(VersionEntity)
export class VersionRepository extends Repository<VersionEntity> {
  getById(id) {
    return this.findOne({ id });
  }

  getAll() {
    return this.find();
  }

  async getOneByIdOrFail(id: number) {
    const response = await this.getById(id);
    if (!response) {
      throw new NotFoundException();
    }
    return response;
  }

  async countVersionInProject(id: number, idProject: number) {
    return await this.count({ where: { id, projectId: idProject } });
  }
}
