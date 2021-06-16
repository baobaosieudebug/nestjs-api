import { OmitType, PartialType } from '@nestjs/swagger';
import { TaskEntity } from '../task.entity';

export class GetTaskRO extends PartialType(
  OmitType(TaskEntity, ['isDelete', 'id'] as const),
) {}
