import { ProjectEntity } from 'src/project/project.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import { GroupsEntity } from '../group/group.entity';
import { TaskEntity } from '../task/task.entity';

@Entity('users')
export class UsersEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  email: string;

  @Column({ type: 'varchar', select: false })
  password: string;

  @Column({ name: 'is_deleted', type: 'varchar', default: null })
  isDeleted: number;

  @ManyToMany(() => GroupsEntity, (group: GroupsEntity) => group.users, {
    cascade: ['insert'],
  })
  groups: GroupsEntity[];

  @OneToMany(() => TaskEntity, (task: TaskEntity) => task.userAssign)
  tasksAssign: TaskEntity[];

  @OneToMany(() => TaskEntity, (task: TaskEntity) => task.user)
  tasks: TaskEntity[];

  @ManyToMany(() => ProjectEntity, (project: ProjectEntity) => project.users, {
    cascade: ['insert'],
  })
  projects: ProjectEntity[];
}
