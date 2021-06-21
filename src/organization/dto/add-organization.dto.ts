import { ApiProperty } from '@nestjs/swagger';
import { Length } from 'class-validator';

export class AddOrganizationDTO {
  @ApiProperty({
    type: String,
    example: 'APPLE',
  })
  @Length(3, 30)
  name: string;

  @ApiProperty({ type: String, example: 'AP-001' })
  @Length(5, 10)
  code: string;
}
