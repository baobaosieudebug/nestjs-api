import { ProjectEntity } from 'src/project/project.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, OneToMany } from 'typeorm';
import { GroupsEntity } from '../group/group.entity';
import { TaskEntity } from '../task/task.entity';
import { Role } from '../authorization/role.enum';
import { OrganizationEntity } from '../organization/organization.entity';

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

  @OneToMany(() => OrganizationEntity, (organization: OrganizationEntity) => organization.user)
  organizations: OrganizationEntity[];
}
