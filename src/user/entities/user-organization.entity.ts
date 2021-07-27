import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { OrganizationEntity } from '../../organization/organization.entity';
import { UserEntity } from './user.entity';

@Entity('user_organization')
export class UserOrganizationEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'organization_id' })
  organizationId: number;

  @Column({
    name: 'active',
    nullable: false,
    default: false,
  })
  active: boolean;

  @CreateDateColumn({ nullable: true })
  attend: Date;

  @UpdateDateColumn({ nullable: true })
  updatedAt: Date;

  @ManyToOne(() => OrganizationEntity, (organization) => organization.userOrganization, { onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'organization_id' })
  organization: OrganizationEntity;

  @ManyToOne(() => UserEntity, (user) => user.userOrganization, { onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
