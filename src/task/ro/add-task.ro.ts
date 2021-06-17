import { ApiProperty } from '@nestjs/swagger';
import { Length } from 'class-validator';

export class AddTaskRO {
  @ApiProperty({
    type: String,
  })
  @Length(10, 255)
  name: string;

  @ApiProperty({ type: String })
  @Length(5, 20)
  codeId: string;
}
