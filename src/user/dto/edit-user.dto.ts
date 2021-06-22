import { ApiProperty } from '@nestjs/swagger';
import { Length } from 'class-validator';

export class EditUserDTO {
  @ApiProperty({ type: String, example: 'John Zoe Mark' })
  @Length(10, 20)
  name: string;

  @ApiProperty({ type: String, example: '4puma!fcv6' })
  @Length(10, 20)
  password: string;
}
