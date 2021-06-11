import { PartialType } from '@nestjs/swagger';
import { AddTaskDTO } from './add-task.dto';

export class EditTaskDTO extends PartialType(AddTaskDTO) {}
