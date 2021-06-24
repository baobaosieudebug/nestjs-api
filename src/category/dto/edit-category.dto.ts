import { ApiProperty } from '@nestjs/swagger';
import { Length } from 'class-validator';

export class EditCategoryDTO {
  @ApiProperty({
    type: String,
    example: 'Development',
  })
  @Length(10, 255)
  name: string;
}
