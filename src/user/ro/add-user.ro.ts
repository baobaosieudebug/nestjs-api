import { ApiProperty } from '@nestjs/swagger';

export class AddUsersRO {
  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;
}
