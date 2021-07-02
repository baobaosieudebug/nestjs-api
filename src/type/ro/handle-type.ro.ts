import { ApiProperty } from '@nestjs/swagger';

export class HandleTypeRO {
  @ApiProperty({
    type: String,
  })
  name: string;

  @ApiProperty({ type: String })
  code: string;

  @ApiProperty({ type: String })
  description: string;
}
