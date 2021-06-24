import { ApiProperty } from '@nestjs/swagger';
import { Length } from 'class-validator';

export class EditStatusDTO {
  @ApiProperty({
    type: String,
    example: 'Closed',
  })
  @Length(2, 255)
  name: string;

  @ApiProperty({ type: String, example: '#56712' })
  @Length(6, 20)
  color: string;
}
