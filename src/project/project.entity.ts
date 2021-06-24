import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { OrganizationEntity } from '../organization/organization.entity';
import { UsersEntity } from '../user/users.entity';
import { TaskEntity } from '../task/task.entity';
import { Category } from '../category/category.entity';
import { Type } from '../type/type.entity';
import { Status } from '../status/status.entity';
import { Version } from 'aws-sdk/clients/swf';

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
  code: string;

  @Column({ name: 'is_deleted', type: 'varchar', default: null })
  isDeleted: number;

  @Column({ name: 'organization_id', nullable: true })
  organizationID: number;

  @ManyToOne(
    () => OrganizationEntity,
    (organization: OrganizationEntity) => organization.projects,
  )
  @JoinColumn({ name: 'organization_id' })
  organization: OrganizationEntity;

  @ManyToMany(() => UsersEntity, (user: UsersEntity) => user.projects, {
    cascade: ['insert'],
  })
  @JoinTable()
  users: UsersEntity[];

  @OneToMany(() => TaskEntity, (task) => task.project)
  categories: Category[];

  @OneToMany(() => TaskEntity, (task) => task.project)
  types: Type[];

  @OneToMany(() => TaskEntity, (task) => task.project)
  statuses: Status[];

  @OneToMany(() => TaskEntity, (task) => task.project)
  versions: Version[];

  @OneToMany(() => TaskEntity, (task) => task.project)
  tasks: TaskEntity[];
}
