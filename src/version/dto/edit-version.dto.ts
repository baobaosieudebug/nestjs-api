import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, Length } from 'class-validator';

export class EditVersionDTO {
  @ApiProperty({
    type: String,
    example: 'Beta 1.0',
  })
  @Length(5, 255)
  name: string;

  @ApiProperty({ type: String, example: 'Description' })
  @Length(5, 50)
  description: string;

  @ApiProperty({ type: String, example: '2020-12-1' })
  @IsDateString()
  startDate: Date;

  @ApiProperty({ type: String, example: '2020-12-1' })
  @IsDateString()
  releaseDate: Date;
}
