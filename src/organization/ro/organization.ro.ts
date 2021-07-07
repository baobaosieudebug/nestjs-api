import { ApiProperty } from '@nestjs/swagger';

export class OrganizationRO {
  @ApiProperty({
    type: String,
  })
  name: string;

  @ApiProperty({ type: String })
  logo: string;

  @ApiProperty({ type: String })
  description: string;

  @ApiProperty({ type: String })
  address: string;

  @ApiProperty({ type: String })
  city: string;

  @ApiProperty({ type: String })
  plan: string;

  @ApiProperty({ type: String })
  country: string;
}
