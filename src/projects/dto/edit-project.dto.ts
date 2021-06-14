import { PartialType } from '@nestjs/swagger';
import { AddProjectDTO } from './add-project.dto';

export class EditProjectDTO extends PartialType(AddProjectDTO) {}
