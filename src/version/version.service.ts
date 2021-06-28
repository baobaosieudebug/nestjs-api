import { Injectable } from '@nestjs/common';
import { VersionRepository } from './version.repository';

@Injectable()
export class VersionService {
  constructor(private readonly versionRepo: VersionRepository) {}

  async getAll(projectId: number) {
    return await this.versionRepo.find({ projectId: projectId });
  }

  async getOneById(id: number) {
    return await this.versionRepo.findOne(id);
  }
}
