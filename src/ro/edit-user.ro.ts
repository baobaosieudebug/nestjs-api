import { PartialType } from '@nestjs/swagger';
import { EditUserDTO } from '../dto/edit-user.dto';

export class EditUserRO extends PartialType(EditUserDTO) {}
