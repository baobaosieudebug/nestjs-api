import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { OrganizationEntity } from '../organization/organization.entity';
import { UsersEntity } from '../user/users.entity';
import { TaskEntity } from '../task/task.entity';
import { CategoryEntity } from '../category/category.entity';
import { TypeEntity } from '../type/type.entity';
import { StatusEntity } from '../status/status.entity';
import { VersionEntity } from '../version/version.entity';

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

  @Column({ name: 'is_deleted', type: 'varchar', default: 0 })
  isDeleted: number;

  @Column({ name: 'organization_id', nullable: true })
  organizationId: number;

  @ManyToOne(() => OrganizationEntity, (organization: OrganizationEntity) => organization.projects)
  @JoinColumn({ name: 'organization_id' })
  organization: OrganizationEntity;

  @ManyToMany(() => UsersEntity, (user: UsersEntity) => user.projects, {
    cascade: ['insert'],
  })
  @JoinTable()
  users: UsersEntity[];

  @OneToMany(() => CategoryEntity, (category) => category.project)
  categories: CategoryEntity[];

  @OneToMany(() => TypeEntity, (type) => type.project)
  types: TypeEntity[];

  @OneToMany(() => StatusEntity, (status) => status.project)
  statuses: StatusEntity[];

  @OneToMany(() => VersionEntity, (version) => version.project)
  versions: VersionEntity[];

  @OneToMany(() => TaskEntity, (task) => task.project)
  tasks: TaskEntity[];
}
