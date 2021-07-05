import { ApiProperty } from '@nestjs/swagger';
import { Length } from 'class-validator';

export class AddOrganizationDTO {
  @ApiProperty({
    type: String,
    example: 'APPLE',
  })
  @Length(3, 30)
  name: string;

  @ApiProperty({ type: String, example: 'AP-002' })
  @Length(5, 10)
  code: string;

  @ApiProperty({ type: String, example: 'Organization of Apple' })
  description: string;

  @ApiProperty({ type: String, example: '19111 Pruners Avenue Cupertino, CA 95014' })
  @Length(5, 255)
  address: string;

  @ApiProperty({ type: String, example: 'Cupertino, California' })
  @Length(5, 50)
  city: string;

  @ApiProperty({ type: String, example: 'Plan' })
  @Length(5, 50)
  plan: string;

  @ApiProperty({ type: String, example: 'America' })
  @Length(5, 20)
  country: string;
}
