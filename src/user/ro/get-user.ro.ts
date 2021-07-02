import { ApiProperty } from '@nestjs/swagger';

export class GetUserRO {
  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ type: String })
  email: string;
}
