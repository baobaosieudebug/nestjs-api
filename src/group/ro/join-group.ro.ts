import { OmitType, PartialType } from '@nestjs/swagger';
import { GroupsEntity } from '../../group/group.entity';

export class JoinGroupRO extends PartialType(
  OmitType(GroupsEntity, ['users'] as const),
) {}
