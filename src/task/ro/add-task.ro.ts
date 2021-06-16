import { OmitType, PartialType } from '@nestjs/swagger';
import { TaskEntity } from '../task.entity';

export class AddTaskRO extends PartialType(
  OmitType(TaskEntity, ['id'] as const),
) {}
