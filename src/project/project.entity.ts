import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { OrganizationEntity } from '../organization/organization.entity';
import { UsersEntity } from 'src/user/users.entity';
import { TaskEntity } from 'src/task/task.entity';

@Entity('project')
export class ProjectEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ type: 'varchar' })
  name: string;

  @ApiProperty()
  @Column({ type: 'varchar' })
  codeId: string;

  @Column({ name: 'is_deleted', type: 'varchar', default: null })
  isDelete: number;

  @ManyToOne(
    () => OrganizationEntity,
    (organization: OrganizationEntity) => organization.projects,
  )
  organization: OrganizationEntity;

  @ManyToMany(() => UsersEntity, (user: UsersEntity) => user.projects, {
    cascade: ['insert'],
  })
  @JoinTable()
  users: UsersEntity[];

  @OneToMany((type) => TaskEntity, (task) => task.project)
  tasks: TaskEntity[];
}
