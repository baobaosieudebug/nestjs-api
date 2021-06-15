import { ApiProperty } from '@nestjs/swagger';
import { ProjectEntity } from 'src/projects/entity/project.entity';
import { TaskEntity } from 'src/tasks/entity/task.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { UsersEntity } from '../../users/entity/users.entity';

@Entity('groups')
export class GroupsEntity {
  @ApiProperty({ type: String, example: '1' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ type: String, example: 'NodeJs' })
  @Column({ type: 'varchar', length: 255 })
  nameGroup: string;

  @ApiProperty({ type: [UsersEntity] })
  @ManyToMany(() => UsersEntity, (user: UsersEntity) => user.groups, {
    cascade: ['insert'],
  })
  @JoinTable()
  users: UsersEntity[];

  @OneToMany(() => TaskEntity, (task: TaskEntity) => task.group)
  tasks: TaskEntity[];

  @ManyToMany(() => ProjectEntity, (project: ProjectEntity) => project.groups, {
    cascade: ['insert'],
  })
  projects: ProjectEntity[];
}
