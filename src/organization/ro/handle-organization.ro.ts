import { ApiProperty } from '@nestjs/swagger';

export class HandleOrganizationRO {
  @ApiProperty({
    type: String,
  })
  name: string;

  @ApiProperty({ type: String })
  code: string;

  @ApiProperty({ type: String })
  domain: string;

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
