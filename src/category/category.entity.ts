import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ProjectEntity } from '../project/project.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ name: 'project_id', nullable: true })
  projectID: number;

  @ManyToOne(() => ProjectEntity, (project) => project.categories)
  @JoinColumn({ name: 'project_id' })
  project: ProjectEntity;
}
