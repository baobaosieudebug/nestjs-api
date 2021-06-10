import { OmitType, PartialType } from '@nestjs/swagger';
import { UsersEntity } from 'src/users/users.entity';

export class GetListUserRO extends PartialType(
  OmitType(UsersEntity, ['password', 'id'] as const),
) {}
