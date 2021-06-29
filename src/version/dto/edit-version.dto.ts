import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, Length } from 'class-validator';

export class EditVersionDTO {
  @ApiProperty({
    type: String,
    example: 'Beta 1.0',
  })
  @Length(5, 255)
  name: string;

  @ApiProperty({ type: String, example: 'Version-001' })
  @Length(5, 20)
  code: string;

  @ApiProperty({ type: String, example: 'Description' })
  @Length(5, 50)
  description: string;

  @ApiProperty({ type: String, example: '2020-12-01' })
  @IsDateString()
  startDate: Date;

  @ApiProperty({ type: String, example: '2020-12-01' })
  @IsDateString()
  releaseDate: Date;
}
