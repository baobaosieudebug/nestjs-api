import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { RoleEntity } from '../../auth/entities/role.entity';

@Entity('user_role')
export class UserRoleEntity extends BaseEntity {
  @PrimaryColumn({ name: 'user_id' })
  userId: number;

  @PrimaryColumn({ name: 'role_id' })
  roleId: number;

  @Column({ name: 'created_by', nullable: false })
  createdBy: number;

  @Column({ name: 'updated_by', nullable: true })
  updateBy: number;

  @CreateDateColumn({ type: 'datetime', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.userRole, { onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => RoleEntity, (role) => role.userRole, { onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'role_id' })
  role: RoleEntity;
}
