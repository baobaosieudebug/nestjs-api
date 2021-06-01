import { OmitType, PartialType } from '@nestjs/swagger';
import { AddUserDTO } from 'src/dto/add-user.dto';

export class AddUserRO extends PartialType(
  OmitType(AddUserDTO, ['password', 'isAdmin'] as const),
) {}
