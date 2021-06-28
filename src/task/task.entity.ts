import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { UsersEntity } from '../user/users.entity';
import { ProjectEntity } from 'src/project/project.entity';

@Entity('task')
export class TaskEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ type: 'varchar' })
  name: string;

  @ApiProperty()
  @Column({ type: 'varchar' })
  code: string;

  @Column({ type: 'varchar', nullable: false })
  description: string;

  @Column({ name: 'date_begin', type: 'date', nullable: false })
  dateBegin: Date;

  @Column({ name: 'date_end', type: 'date', nullable: false })
  dateEnd: Date;

  @Column({ name: 'created_at', type: 'date', nullable: false })
  createdAt: Date;

  @Column({ name: 'create_user_id', nullable: true })
  createUserId: number;

  @Column({ name: 'assign_user_id', nullable: true })
  assignUserId: number;

  @Column({ name: 'is_deleted', type: 'varchar', default: null })
  isDeleted: number;

  @Column({ name: 'project_id', nullable: true })
  projectId: number;

  @ManyToOne(() => UsersEntity, (user: UsersEntity) => user.tasksAssign)
  @JoinColumn({ name: 'assign_user_id' })
  userAssign: UsersEntity;

  @ManyToOne(() => UsersEntity, (user: UsersEntity) => user.tasks)
  @JoinColumn({ name: 'create_user_id' })
  user: UsersEntity;

  @ManyToOne(() => ProjectEntity, (project) => project.tasks)
  @JoinColumn({ name: 'project_id' })
  project: ProjectEntity;
}
