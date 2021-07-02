import { ApiProperty } from '@nestjs/swagger';

export class HandleUserRO {
  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ type: String })
  email: string;
}
