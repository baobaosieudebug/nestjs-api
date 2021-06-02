import { OmitType, PartialType } from '@nestjs/swagger';
import { GroupsEntity } from 'src/group/group.entity';
import { UsersEntity } from 'src/users/users.entity';

export class GetAllGroupRO extends PartialType(
  OmitType(UsersEntity, ['isAdmin', 'password', 'id'] as const),
) {}
