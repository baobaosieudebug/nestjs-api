import { ApiProperty } from '@nestjs/swagger';

export class HandleTaskRO {
  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ type: String })
  code: string;

  @ApiProperty({ type: String })
  description: string;

  @ApiProperty({ type: Date })
  dateBegin: Date;

  @ApiProperty({ type: Date })
  dateEnd: Date;
}
