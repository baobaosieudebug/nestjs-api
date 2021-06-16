import { PartialType } from '@nestjs/swagger';
import { UsersEntity } from '../entity/users.entity';

export class EditUserDTO extends PartialType(UsersEntity) {}
