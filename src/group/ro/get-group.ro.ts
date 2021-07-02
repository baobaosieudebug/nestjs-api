import { ApiProperty } from '@nestjs/swagger';

export class GetGroupRO {
  @ApiProperty({ type: String })
  nameGroup: string;
}
