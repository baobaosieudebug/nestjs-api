import { EntityRepository, Repository } from 'typeorm';
import { Version } from './version.entity';

@EntityRepository(Version)
export class VersionRepository extends Repository<Version> {
  getById(id) {
    return this.findOne({ id });
  }

  getAll() {
    return this.find();
  }
}
