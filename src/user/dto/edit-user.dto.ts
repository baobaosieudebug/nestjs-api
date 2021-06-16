import { PartialType } from '@nestjs/swagger';
import { AddUserDTO } from './add-user.dto';

export class EditUserDTO extends PartialType(AddUserDTO) {}
