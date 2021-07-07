import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
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

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'owner_id', nullable: true })
  ownerId: number;

  @Column({ name: 'is_deleted', type: 'varchar', default: 0 })
  isDeleted: number;

  @OneToOne(() => UsersEntity, (user: UsersEntity) => user.organization)
  @JoinColumn({ name: 'owner_id' })
  user: UsersEntity;

  @OneToMany(() => ProjectEntity, (project: ProjectEntity) => project.organization)
  projects: ProjectEntity[];

  @ManyToMany(() => UsersEntity, (user: UsersEntity) => user.organizations, {
    cascade: ['insert'],
  })
  @JoinTable()
  users: UsersEntity[];
}
