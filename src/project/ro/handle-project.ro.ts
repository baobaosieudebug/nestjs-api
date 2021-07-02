import { ApiProperty } from '@nestjs/swagger';

export class HandleProjectRO {
  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ type: String })
  code: string;

  @ApiProperty({ type: Number })
  organizationId: number;
}
