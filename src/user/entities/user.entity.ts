import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProjectEntity } from '../../project/project.entity';
import { TaskEntity } from '../../task/task.entity';
import { OrganizationEntity } from '../../organization/organization.entity';
import { UserOrganizationEntity } from './user-organization.entity';
import { UserProjectEntity } from './user-project.entity';
import { UserRoleEntity } from './user-role.entity';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  code: string;

  @Column({ type: 'varchar', nullable: false })
  username: string;

  @Column({ type: 'varchar', nullable: false })
  email: string;

  @Column({ type: 'varchar', nullable: false, select: true })
  password: string;

  @Column({ type: 'varchar', nullable: true })
  status: string;

  @Column({ type: 'varchar', nullable: true })
  phone: string;

  @Column({ type: 'varchar', nullable: true })
  avatar: string;

  @Column({ name: 'is_deleted', type: 'varchar', default: 0 })
  isDeleted: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToOne(() => OrganizationEntity, (organization: OrganizationEntity) => organization.user)
  organization: OrganizationEntity;

  @OneToOne(() => ProjectEntity, (project: ProjectEntity) => project.createBy)
  project: ProjectEntity;

  @OneToOne(() => ProjectEntity, (project: ProjectEntity) => project.admin)
  projectAdmin: ProjectEntity;

  @OneToMany(() => TaskEntity, (task: TaskEntity) => task.userAssign)
  tasksAssign: TaskEntity[];

  @OneToMany(() => TaskEntity, (task: TaskEntity) => task.user)
  tasks: TaskEntity[];

  @OneToMany(() => UserOrganizationEntity, (userOrganization) => userOrganization.user)
  userOrganization: UserOrganizationEntity;

  @OneToMany(() => UserProjectEntity, (userProject) => userProject.user)
  userProject: UserProjectEntity;

  @OneToMany(() => UserRoleEntity, (userRole) => userRole.user)
  userRole: UserRoleEntity;
}
