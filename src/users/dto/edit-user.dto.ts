import { OmitType } from '@nestjs/swagger';
import { AddUserDTO } from './add-user.dto';

export class EditUserDTO extends OmitType(AddUserDTO, ['isAdmin'] as const) {}
