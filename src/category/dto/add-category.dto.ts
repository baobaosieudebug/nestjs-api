import { ApiProperty } from '@nestjs/swagger';
import { Length } from 'class-validator';

export class AddCategoryDTO {
  @ApiProperty({
    type: String,
    example: 'Development',
  })
  @Length(10, 255)
  name: string;
}
