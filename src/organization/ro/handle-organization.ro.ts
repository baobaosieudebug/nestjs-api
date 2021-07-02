import { ApiProperty } from '@nestjs/swagger';

export class HandleOrganizationRO {
  @ApiProperty({
    type: String,
  })
  name: string;

  @ApiProperty({ type: String })
  code: string;
}
