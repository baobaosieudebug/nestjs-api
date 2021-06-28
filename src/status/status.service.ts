import { Injectable } from '@nestjs/common';
import { StatusRepository } from './status.repository';

@Injectable()
export class StatusService {
  constructor(private readonly statusRepo: StatusRepository) {}

  async getAll(projectId: number) {
    return await this.statusRepo.find({ projectId: projectId });
  }

  async getOneById(id: number) {
    return await this.statusRepo.findOne(id);
  }
}
