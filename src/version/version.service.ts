import { Injectable } from '@nestjs/common';
import { ProjectService } from '../project/project.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Version } from './version.entity';
import { Repository } from 'typeorm';
import { BaseService } from '../common/service/base.service';

@Injectable()
export class VersionService extends BaseService<Version> {
  constructor(
    @InjectRepository(Version)
    private version: Repository<Version>,
    private projectService: ProjectService,
  ) {
    super(version, projectService);
  }
}
