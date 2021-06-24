import { EntityRepository, Repository } from 'typeorm';
import { Status } from './status.entity';

@EntityRepository(Status)
export class StatusRepository extends Repository<Status> {
  getById(id) {
    return this.findOne({ id });
  }

  getAll() {
    return this.find();
  }
}
