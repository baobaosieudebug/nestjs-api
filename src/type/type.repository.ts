import { EntityRepository, Repository } from 'typeorm';
import { Type } from './type.entity';
import { NotFoundException } from '@nestjs/common';

@EntityRepository(Type)
export class TypeRepository extends Repository<Type> {
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

  async countTypeInProject(id: number, idProject: number) {
    return await this.count({ where: { id, projectID: idProject } });
  }
}
