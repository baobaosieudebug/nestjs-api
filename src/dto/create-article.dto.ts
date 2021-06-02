import { ApiProperty } from '@nestjs/swagger';

export class CreateArticleDTO {
  @ApiProperty({
    type: String,
    example: 'Code Dao Ky Su',
  })
  name: string;

  @ApiProperty({ type: String, example: '17' })
  authorId: string;

  @ApiProperty({ type: Boolean, example: 'true' })
  isPublished: boolean;
}
