import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { AddUserDTO } from 'src/dto/add-user.dto';

export class AddUsersRO {
  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;
}
