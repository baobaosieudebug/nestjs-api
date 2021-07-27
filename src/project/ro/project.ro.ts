import { ApiProperty } from '@nestjs/swagger';

export class ProjectRO {
  @ApiProperty({ type: Number })
  id: number;

  @ApiProperty({ type: String })
  code: string;

  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ type: String })
  description: string;
}
