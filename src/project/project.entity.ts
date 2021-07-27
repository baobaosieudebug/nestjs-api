import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { OrganizationEntity } from '../organization/organization.entity';
import { UserEntity } from '../user/entities/user.entity';
import { TaskEntity } from '../task/task.entity';
import { CategoryEntity } from '../category/category.entity';
import { TypeEntity } from '../type/type.entity';
import { StatusEntity } from '../status/status.entity';
import { VersionEntity } from '../version/version.entity';
import { UserProjectEntity } from '../user/entities/user-project.entity';

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

  @Column({ type: 'varchar', nullable: false })
  description: string;

  @Column({ type: 'varchar', nullable: true })
  logo: string;

  @Column({ name: 'is_deleted', type: 'varchar', default: 0 })
  isDeleted: number;

  @Column({ name: 'organization_id', nullable: true })
  organizationId: number;

  @Column({ name: 'create_by', nullable: true, default: null })
  createById: number;

  @Column({ name: 'admin_id', nullable: true, default: null })
  adminId: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToOne(() => UserEntity, (user: UserEntity) => user.project)
  @JoinColumn({ name: 'created_by' })
  createBy: UserEntity;

  @OneToOne(() => UserEntity, (user: UserEntity) => user.projectAdmin)
  @JoinColumn({ name: 'admin_id' })
  admin: UserEntity;

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

  @OneToMany(() => UserProjectEntity, (userProject) => userProject.project)
  userProject: UserProjectEntity;

  @ManyToOne(() => OrganizationEntity, (organization: OrganizationEntity) => organization.projects)
  @JoinColumn({ name: 'organization_id' })
  organization: OrganizationEntity;
}
