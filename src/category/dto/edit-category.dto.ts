import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class EditCategoryDTO {
  @ApiProperty({
    type: String,
    example: 'Development',
  })
  @Length(5, 255)
  name: string;

  @ApiProperty({ type: String, example: 'Category-001' })
  @Length(5, 20)
  code: string;

  @ApiProperty({ example: 'The List Category Development' })
  @IsString()
  description: string;
}
