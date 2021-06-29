import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class EditStatusDTO {
  @ApiProperty({
    type: String,
    example: 'Closed',
  })
  @ApiProperty({ type: String, example: 'Status-001' })
  @Length(5, 20)
  code: string;

  @ApiProperty({ example: 'The Status Is Closed' })
  @IsString()
  description: string;
}
