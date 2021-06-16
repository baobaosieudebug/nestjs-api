import { PartialType } from '@nestjs/swagger';
import { UsersEntity } from '../users.entity';

export class EditUserDTO extends PartialType(UsersEntity) {}
