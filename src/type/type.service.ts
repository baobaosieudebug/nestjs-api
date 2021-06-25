import { Injectable } from '@nestjs/common';
import { ProjectService } from '../project/project.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Type } from './type.entity';
import { Repository } from 'typeorm';
import { BaseService } from '../common/service/base.service';

@Injectable()
export class TypeService extends BaseService<Type> {
  constructor(
    @InjectRepository(Type)
    private type: Repository<Type>,
    private projectService: ProjectService,
  ) {
    super(type, projectService);
  }
}
