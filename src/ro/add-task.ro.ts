import { OmitType, PartialType } from '@nestjs/swagger';
import { TaskEntity } from 'src/users/tasks/task.entity';

export class AddTaskRO extends PartialType(
  OmitType(TaskEntity, ['id', 'projectId'] as const),
) {}
