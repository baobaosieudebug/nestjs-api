import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ResourceEntity } from './resource.entity';
import { PermissionEntity } from './permission.entity';

@Entity('action')
export class ActionEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'varchar', nullable: false })
  code: string;

  @Column({ name: 'resource_id', nullable: false })
  resourceId: number;

  @OneToMany(() => PermissionEntity, (permission) => permission.action)
  permissions: PermissionEntity[];

  @ManyToOne(() => ResourceEntity, (resource) => resource.actions)
  @JoinColumn({ name: 'resource_id' })
  resource: ResourceEntity;
}
