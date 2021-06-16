import { PartialType } from '@nestjs/swagger';
import { AddGroupDTO } from './add-group.dto';

export class EditGroupDTO extends PartialType(AddGroupDTO) {}
