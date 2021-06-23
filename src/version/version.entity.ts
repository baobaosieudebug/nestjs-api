import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Version {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
