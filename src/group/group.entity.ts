import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { UsersEntity } from '../users/users.entity';

@Entity('groups')
export class GroupsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nameGroup: string;

  // @ManyToOne(type => UsersEntity, user => user.groups) // note: we will create author property in the Photo class below
  // userCretead: UsersEntity;

  @ManyToMany(() => UsersEntity, (user: UsersEntity) => user.groups, {
    cascade: ['insert'],
  })
  @JoinTable()
  users: UsersEntity[];
}
