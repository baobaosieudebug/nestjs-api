import { OmitType, PartialType } from '@nestjs/swagger';
import { GroupsEntity } from 'src/group/entity/group.entity';

export class JoinGroupRO extends PartialType(
  OmitType(GroupsEntity, ['users'] as const),
) {}
