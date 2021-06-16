import { ApiProperty } from '@nestjs/swagger';
import { Length } from 'class-validator';

export class AddGroupDTO {
  @ApiProperty({ type: String, example: 'NodeJS' })
  @Length(4, 255)
  nameGroup: string;
}
