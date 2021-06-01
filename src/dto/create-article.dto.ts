import { ApiProperty } from '@nestjs/swagger';
import { PrimaryGeneratedColumn } from 'typeorm';

export class CreateArticleDTO {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  authorId: string;

  @ApiProperty()
  isPublished: boolean;
}
