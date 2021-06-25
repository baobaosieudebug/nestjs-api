import { Injectable } from '@nestjs/common';
import { ProjectService } from '../project/project.service';
import { BaseService } from '../common/service/base.service';
import { Status } from './status.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class StatusService extends BaseService<Status> {
  constructor(
    @InjectRepository(Status)
    private status: Repository<Status>,
    private projectService: ProjectService,
  ) {
    super(status, projectService);
  }
}
