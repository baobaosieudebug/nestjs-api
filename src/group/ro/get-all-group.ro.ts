import { OmitType, PartialType } from '@nestjs/swagger';
import { UsersEntity } from '../../user/users.entity';

export class GetAllGroupRO extends PartialType(
  OmitType(UsersEntity, ['password', 'id'] as const),
) {}
