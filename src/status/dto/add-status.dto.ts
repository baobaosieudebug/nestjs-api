import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class AddStatusDTO {
  @ApiProperty({
    type: String,
    example: 'Open',
  })
  @Length(2, 255)
  name: string;

  @ApiProperty({ type: String, example: 'Status-001' })
  @Length(5, 20)
  code: string;

  @ApiProperty({ example: 'The Status Is Open' })
  @IsString()
  description: string;
}
