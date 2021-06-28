import { Injectable } from '@nestjs/common';
import { TypeRepository } from './type.repository';

@Injectable()
export class TypeService {
  constructor(private readonly typeRepo: TypeRepository) {}

  async getAll(projectId: number) {
    return await this.typeRepo.find({ projectId: projectId });
  }

  async getOneById(id: number) {
    return await this.typeRepo.findOne(id);
  }
}
