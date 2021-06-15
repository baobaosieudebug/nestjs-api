import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';

export class BaseService<childRepo> {
  constructor(private repo: Repository<childRepo>) {}

  getAll(): Promise<childRepo[]> {
    return this.repo.find();
  }

  getOneById(id: number): Promise<childRepo> {
    return this.repo.findOne(id);
  }

  async getOneByIdOrFail(id: number): Promise<childRepo | unknown> {
    const response = await this.getOneById(id);
    if (!response) {
      throw new NotFoundException();
    }
    return response;
  }
}
