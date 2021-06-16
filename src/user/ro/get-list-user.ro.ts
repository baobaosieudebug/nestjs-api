import { OmitType, PartialType } from '@nestjs/swagger';
import { UsersEntity } from '../../user/users.entity';

export class GetListUserRO extends PartialType(
  OmitType(UsersEntity, ['password', 'id'] as const),
) {}
