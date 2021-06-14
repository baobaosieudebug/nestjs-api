import { ApiProperty } from '@nestjs/swagger';

export class AddOrganizationDTO {
  @ApiProperty({
    type: String,
    example: 'Get User By Id',
  })
  name: string;

  @ApiProperty({ type: String, example: 'BE-001' })
  codeId: string;
}
