import { OmitType, PartialType } from '@nestjs/swagger';
import { UsersEntity } from 'src/users/entity/users.entity';

export class GetUserRO extends PartialType(
  OmitType(UsersEntity, ['password', 'id'] as const),
) {}
