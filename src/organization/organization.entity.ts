import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProjectEntity } from '../project/project.entity';
import { UsersEntity } from '../user/users.entity';

@Entity('organization')
export class OrganizationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  code: string;

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'varchar', nullable: false })
  domain: string;

  @Column({ type: 'varchar', nullable: true })
  logo: string;

  @Column({ type: 'varchar', nullable: false })
  description: string;

  @Column({ type: 'varchar', nullable: false })
  address: string;

  @Column({ type: 'varchar', nullable: false })
  city: string;

  @Column({ type: 'varchar', nullable: false })
  plan: string;

  @Column({ type: 'varchar', nullable: false })
  country: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt: Date;

  @Column({ name: 'owner_id', nullable: true })
  ownerId: number;

  @Column({ name: 'is_deleted', type: 'varchar', default: 0 })
  isDeleted: number;

  @OneToMany(() => ProjectEntity, (project: ProjectEntity) => project.organization)
  projects: ProjectEntity[];

  @OneToOne(() => UsersEntity, (user: UsersEntity) => user.organizations)
  @JoinColumn({ name: 'owner_id' })
  user: UsersEntity;
}
