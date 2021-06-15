import { OmitType, PartialType } from '@nestjs/swagger';
import { TaskEntity } from '../entity/task.entity';

export class AddTaskRO extends PartialType(
  OmitType(TaskEntity, ['id'] as const),
) {}
