import { OmitType } from '@nestjs/swagger';
import { GroupsEntity } from 'src/group/entity/group.entity';

export class EditGroupDTO extends OmitType(GroupsEntity, [
  'users',
  'id',
] as const) {}
