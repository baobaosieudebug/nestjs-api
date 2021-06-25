import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ProjectEntity } from '../project/project.entity';

@Entity()
export class Version {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ name: 'date_begin', type: 'date', nullable: false })
  startDate: Date;

  @Column({ name: 'date_release', type: 'date', nullable: false })
  releaseDate: Date;

  @Column({ name: 'project_id', nullable: true })
  projectID: number;

  @ManyToOne(() => ProjectEntity, (project) => project.versions)
  @JoinColumn({ name: 'project_id' })
  project: ProjectEntity;
}
