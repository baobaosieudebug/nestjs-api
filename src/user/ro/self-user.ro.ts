import { ApiProperty } from '@nestjs/swagger';

export class SelfUserRO {
  @ApiProperty({ type: String })
  username: string;

  @ApiProperty({ type: String })
  email: string;

  @ApiProperty({ type: String })
  phone: string;

  @ApiProperty({ type: String })
  avatar: string;

  @ApiProperty({ type: String })
  status: string;
}
