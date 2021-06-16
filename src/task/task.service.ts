import { Injectable } from '@nestjs/common';
import { TaskEntity } from './task.entity';
import { BaseService } from 'src/common/service/base.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TaskService extends BaseService<TaskEntity> {
  constructor(
    @InjectRepository(TaskEntity)
    private taskRepo: Repository<TaskEntity>,
  ) {
    super(taskRepo);
  }
}
