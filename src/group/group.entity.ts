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

  @Column({ type: 'varchar' })
  nameGroup: string;

  @ManyToMany(() => UsersEntity, (user: UsersEntity) => user.groups, {
    cascade: ['insert'],
  })
  @JoinTable()
  users: UsersEntity[];
}
