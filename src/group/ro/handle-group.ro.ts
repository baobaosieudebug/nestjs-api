import { ApiProperty } from '@nestjs/swagger';

export class HandleGroupRO {
  @ApiProperty({ type: String })
  nameGroup: string;
}
