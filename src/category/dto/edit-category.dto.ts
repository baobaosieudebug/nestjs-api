import { ApiProperty } from '@nestjs/swagger';
import { Length } from 'class-validator';

export class EditCategoryDTO {
  @ApiProperty({
    type: String,
    example: 'Development',
  })
  @Length(5, 255)
  name: string;
}
