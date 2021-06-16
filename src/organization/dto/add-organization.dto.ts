import { ApiProperty } from '@nestjs/swagger';
import { Length } from 'class-validator';

export class AddOrganizationDTO {
  @ApiProperty({
    type: String,
    example: 'Get User By Id',
  })
  @Length(10, 30)
  name: string;

  @ApiProperty({ type: String, example: 'BE-001' })
  @Length(5, 10)
  codeId: string;
}
