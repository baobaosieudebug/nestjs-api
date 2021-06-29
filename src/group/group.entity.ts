import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { UsersEntity } from '../user/users.entity';

@Entity('groups')
export class GroupsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name_group', type: 'varchar' })
  nameGroup: string;

  @Column({ name: 'is_deleted', type: 'varchar', default: 0 })
  isDeleted: number;

  @ManyToMany(() => UsersEntity, (user: UsersEntity) => user.groups, {
    cascade: ['insert'],
  })
  @JoinTable()
  users: UsersEntity[];
}
