import { ApiProperty } from '@nestjs/swagger';
import { Length } from 'class-validator';

export class AddProjectDTO {
  @ApiProperty({
    type: String,
    example: 'Phat trien he thong chat bot tren Iphone',
  })
  @Length(10, 255)
  name: string;

  @ApiProperty({ type: String, example: 'IOS-001' })
  @Length(5, 20)
  codeId: string;
}
