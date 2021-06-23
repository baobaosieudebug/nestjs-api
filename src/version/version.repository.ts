import { EntityRepository, Repository } from 'typeorm';
import { Version } from './version.entity';

@EntityRepository(Version)
export class VersionRepository extends Repository<Version> {}
