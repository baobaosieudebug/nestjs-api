import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ResourceEntity } from './resource.entity';
import { RoleEntity } from './role.entity';
import { ActionEntity } from './action.entity';

@Entity('permission')
export class PermissionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'resource_id', nullable: false })
  resourceId: number;

  @Column({ name: 'role_id', nullable: false })
  roleId: number;

  @Column({ name: 'action_id', nullable: false })
  actionId: number;

  @Column({ name: 'allowed', nullable: false })
  allowed: number;

  @Column({ name: 'created_by', nullable: false })
  createdBy: number;

  @Column({ name: 'updated_by', nullable: true })
  updateBy: number;

  @CreateDateColumn({ type: 'datetime', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => ResourceEntity, (resource) => resource.permissions)
  @JoinColumn({ name: 'resource_id' })
  resource: ResourceEntity;

  @ManyToOne(() => RoleEntity, (role) => role.permissions)
  @JoinColumn({ name: 'role_id' })
  role: RoleEntity;

  @ManyToOne(() => ActionEntity, (action) => action.permissions)
  @JoinColumn({ name: 'action_id' })
  action: ActionEntity;
}
