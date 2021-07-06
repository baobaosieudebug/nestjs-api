import { ApiProperty } from '@nestjs/swagger';
import { Length } from 'class-validator';

export class AddProjectDTO {
  @ApiProperty({
    type: String,
    example: 'Development Operating System For IOS 10 ',
  })
  @Length(10, 255)
  name: string;

  @ApiProperty({ type: String, example: 'Project of Apple' })
  @Length(5, 255)
  description: string;
}
