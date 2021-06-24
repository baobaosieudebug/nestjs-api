import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { ProjectEntity } from "../project/project.entity";

@Entity()
export class Status {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  color: string;

  @Column({ name: 'project_id', nullable: true })
  projectID: number;

  @ManyToOne(() => ProjectEntity, (project) => project.statuses)
  @JoinColumn({ name: 'project_id' })
  project: ProjectEntity;
}
