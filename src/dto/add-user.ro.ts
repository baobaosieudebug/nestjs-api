import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { AddUserDTO } from 'src/dto/add-user.dto';

export class AddUsersRO {
  name: string;

  email: string;

  password: string;

  isAdmin: boolean;
}
