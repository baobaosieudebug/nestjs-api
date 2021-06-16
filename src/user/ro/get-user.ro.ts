import { OmitType, PartialType } from '@nestjs/swagger';
import { UsersEntity } from 'src/user/users.entity';

export class GetUserRO extends PartialType(
  OmitType(UsersEntity, ['password', 'id'] as const),
) {}
