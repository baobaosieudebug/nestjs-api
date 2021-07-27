import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrganizationEntity } from '../../organization/organization.entity';
import { PermissionEntity } from './permission.entity';
import { UserRoleEntity } from '../../user/entities/user-role.entity';

@Entity('role')
export class RoleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'varchar', nullable: false })
  code: string;

  @Column({ name: 'organization_id', nullable: false })
  organizationId: number;

  @Column({ name: 'created_by', nullable: true })
  createdBy: number;

  @Column({ name: 'updated_by', nullable: true })
  updateBy: number;

  @CreateDateColumn({ type: 'datetime', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => PermissionEntity, (permission) => permission.role)
  permissions: PermissionEntity[];

  @ManyToOne(() => OrganizationEntity, (organization) => organization.roles)
  @JoinColumn({ name: 'organization_id' })
  organization: OrganizationEntity;

  @OneToMany(() => UserRoleEntity, (userRole) => userRole.role)
  userRole: UserRoleEntity;
}
