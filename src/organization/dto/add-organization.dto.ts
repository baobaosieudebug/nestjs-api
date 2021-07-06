import { ApiProperty } from '@nestjs/swagger';
import { Length } from 'class-validator';

export class AddOrganizationDTO {
  @ApiProperty({
    type: String,
    example: 'APPLE',
  })
  @Length(3, 30)
  name: string;

  @ApiProperty({ type: String })
  code: string;

  @ApiProperty({ type: String, example: 'Apple.com' })
  @Length(5, 50)
  domain: string;

  @ApiProperty({ type: String, example: 'Organization of Apple' })
  @Length(5, 255)
  description: string;

  @ApiProperty({ type: String, example: '19111 Pruners Avenue Cupertino, CA 95014' })
  @Length(5, 255)
  address: string;

  @ApiProperty({ type: String, example: 'Cupertino, California' })
  @Length(5, 50)
  city: string;

  @ApiProperty({ type: String, example: 'Planing' })
  @Length(5, 50)
  plan: string;

  @ApiProperty({ type: String, example: 'America' })
  @Length(5, 20)
  country: string;
}
