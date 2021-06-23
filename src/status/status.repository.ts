import { EntityRepository, Repository } from 'typeorm';
import { Status } from './status.entity';

@EntityRepository(Status)
export class StatusRepository extends Repository<Status> {}
