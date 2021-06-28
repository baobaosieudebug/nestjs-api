import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsString, Length } from 'class-validator';

export class AddTaskDTO {
  @ApiProperty({
    type: String,
    example: 'Get User By Id',
  })
  @Length(10, 255)
  name: string;

  @ApiProperty({ type: String, example: 'BE-001' })
  @Length(5, 20)
  code: string;

  @ApiProperty({ example: 'Create UI For Website' })
  @IsString()
  description: string;

  @ApiProperty({ example: '2020-01-01' })
  @IsDateString()
  dateBegin: Date;

  @ApiProperty({ example: '2020-01-01' })
  @IsDateString()
  dateEnd: Date;
}
