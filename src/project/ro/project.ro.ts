import { ApiProperty } from '@nestjs/swagger';

export class ProjectRO {
  @ApiProperty({ type: String })
  name: string;

  @ApiProperty({ type: Number })
  organizationId: number;
}
