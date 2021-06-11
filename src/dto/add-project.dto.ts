import { ApiProperty } from '@nestjs/swagger';

export class AddProjectDTO {
  @ApiProperty({
    type: String,
    example: 'Phat trien he thong chat bot tren Iphone',
  })
  name: string;

  @ApiProperty({ type: String, example: 'IOS-001' })
  codeId: string;
}
