import { OmitType, PartialType } from '@nestjs/swagger';
import { AddUserDTO } from '../dto/add-user.dto';

export class GetUserRO extends PartialType(
  OmitType(AddUserDTO, ['password', 'isAdmin'] as const),
) {}
