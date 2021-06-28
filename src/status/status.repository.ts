import { EntityRepository, Repository } from 'typeorm';
import { StatusEntity } from './status.entity';
import { NotFoundException } from '@nestjs/common';

@EntityRepository(StatusEntity)
export class StatusRepository extends Repository<StatusEntity> {
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

  async countStatusInProject(id: number, idProject: number) {
    return await this.count({ where: { id, projectId: idProject } });
  }
}
