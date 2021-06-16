import { PartialType } from '@nestjs/swagger';
import { UsersEntity } from '../users.entity';
import { AddUserDTO } from './add-user.dto';

export class EditUserDTO extends PartialType(AddUserDTO) {}
