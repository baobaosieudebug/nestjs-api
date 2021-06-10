import { OmitType, PartialType } from '@nestjs/swagger';
import { UserRepository } from 'src/repo/user.repository';
import { UsersEntity } from 'src/users/users.entity';
import { AddUserDTO } from '../dto/add-user.dto';

export class GetUserRO extends PartialType(
  OmitType(UsersEntity, ['password', 'id'] as const),
) {}
