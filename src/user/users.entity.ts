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

  @Column({ name: 'is_delete', type: 'varchar', default: null })
  isDelete: number;

  @ManyToMany(() => GroupsEntity, (group: GroupsEntity) => group.users, {
    cascade: ['insert'],
  })
  groups: GroupsEntity[];

  @OneToMany(() => TaskEntity, (task: TaskEntity) => task.user)
  tasks: TaskEntity[];
}
