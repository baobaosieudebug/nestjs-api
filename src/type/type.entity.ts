import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { ProjectEntity } from "../project/project.entity";

@Entity()
export class Type {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ name: 'project_id', nullable: true })
  projectID: number;

  @ManyToOne(() => ProjectEntity, (project) => project.types)
  @JoinColumn({ name: 'project_id' })
  project: ProjectEntity;
}
