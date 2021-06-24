import { ApiProperty } from '@nestjs/swagger';
import { Length } from 'class-validator';

export class AddStatusDTO {
  @ApiProperty({
    type: String,
    example: 'Open',
  })
  @Length(2, 255)
  name: string;

  @ApiProperty({ type: String, example: '#56712' })
  @Length(6, 20)
  color: string;
}
