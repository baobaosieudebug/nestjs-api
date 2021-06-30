import { ApiProperty } from '@nestjs/swagger';

export class AddUsersRO {
  @ApiProperty({
    type: String,
  })
  name: string;

  @ApiProperty({
    type: String,
  })
  email: string;
}
