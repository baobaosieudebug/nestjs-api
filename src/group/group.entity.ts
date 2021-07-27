import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { UserEntity } from '../user/entities/user.entity';

@Entity('group')
export class GroupsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name_group', type: 'varchar' })
  nameGroup: string;

  @Column({ name: 'is_deleted', type: 'varchar', default: 0 })
  isDeleted: number;
}
