import { EntityRepository, Repository } from 'typeorm';
import { Version } from './version.entity';
import { NotFoundException } from "@nestjs/common";

@EntityRepository(Version)
export class VersionRepository extends Repository<Version> {
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
    return await this.count({ where: { id, projectID: idProject } });
  }
}
