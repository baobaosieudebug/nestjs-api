import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ActionEntity } from './action.entity';
import { PermissionEntity } from './permission.entity';

@Entity('resource')
export class ResourceEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column({ type: 'varchar', nullable: false })
  code: string;

  @OneToMany(() => ActionEntity, (action) => action.resource)
  actions: ActionEntity[];

  @OneToMany(() => PermissionEntity, (permission) => permission.resource)
  permissions: PermissionEntity[];
}
