import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, OneToMany, OneToOne } from 'typeorm';
import { ProjectEntity } from '../project/project.entity';
import { GroupsEntity } from '../group/group.entity';
import { TaskEntity } from '../task/task.entity';
import { OrganizationEntity } from '../organization/organization.entity';
import { Role } from '../auth/role.enum';

@Entity('users')
export class UsersEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  email: string;

  @Column({ type: 'varchar', select: true })
  password: string;

  @Column({ name: 'is_deleted', type: 'varchar', default: 0 })
  isDeleted: number;

  @Column({ type: 'enum', enum: Role, default: Role.User })
  roles: Role;

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

  @ManyToMany(() => GroupsEntity, (group: GroupsEntity) => group.users, {
    cascade: ['insert'],
  })
  groups: GroupsEntity[];

  @ManyToMany(() => ProjectEntity, (project: ProjectEntity) => project.users, {
    cascade: ['insert'],
  })
  projects: ProjectEntity[];

  @ManyToMany(() => OrganizationEntity, (organizations: OrganizationEntity) => organizations.users, {
    cascade: ['insert'],
  })
  organizations: OrganizationEntity[];
}
