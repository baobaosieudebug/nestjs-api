import { ApiProperty } from '@nestjs/swagger';

export class EditUserRO {
  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ type: String })
  email: string;
}
