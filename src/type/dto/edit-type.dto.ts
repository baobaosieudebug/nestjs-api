import { ApiProperty } from '@nestjs/swagger';
import { Length } from 'class-validator';

export class EditTypeDTO {
  @ApiProperty({
    type: String,
    example: 'Bug',
  })
  @Length(2, 255)
  name: string;

  @ApiProperty({ type: String, example: 'Description' })
  @Length(5, 50)
  description: string;
}
