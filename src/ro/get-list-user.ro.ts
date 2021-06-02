import { PickType } from '@nestjs/swagger';
import { UsersEntity } from 'src/users/users.entity';

export class GetListUserRO extends PickType(UsersEntity, [
  'name',
  'id',
] as const) {}
