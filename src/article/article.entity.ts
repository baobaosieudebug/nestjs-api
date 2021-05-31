import { Length } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('article')
export class ArticleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Length(10, 20)
  name: string;

  @Column()
  isPublished: boolean;

  @Column()
  @Length(4, 20)
  authorId: string;
}
