import { ApiProperty } from '@nestjs/swagger';
import { Length } from 'class-validator';

export class AddTaskDTO {
  @ApiProperty({
    type: String,
    example: 'Get User By Id',
  })
  @Length(10, 255)
  name: string;

  @ApiProperty({ type: String, example: 'BE-001' })
  @Length(5, 20)
  codeId: string;
}
