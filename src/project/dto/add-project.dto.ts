import { ApiProperty } from '@nestjs/swagger';
import { Length } from 'class-validator';

export class AddProjectDTO {
  @ApiProperty({
    type: String,
    example: 'Phat trien he thong chat bot tren Iphone',
  })
  @Length(10, 20)
  name: string;

  @ApiProperty({ type: String, example: 'IOS-001' })
  @Length(10, 20)
  codeId: string;
}
