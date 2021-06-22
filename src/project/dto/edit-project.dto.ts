import { ApiProperty } from '@nestjs/swagger';
import { Length } from 'class-validator';

export class EditProjectDTO {
  @ApiProperty({
    type: String,
    example: 'Development Operating System for IOS 15',
  })
  @Length(10, 255)
  name: string;

  @ApiProperty({ type: String, example: 'IOS-001' })
  @Length(5, 20)
  code: string;
}
