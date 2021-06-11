import { OmitType } from '@nestjs/swagger';
import { GroupsEntity } from 'src/group/group.entity';

export class EditGroupDTO extends OmitType(GroupsEntity, [
  'users',
  'id',
] as const) {}
