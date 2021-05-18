import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import { GroupsEntity } from '../group/group.entity';
import { AddressEntity } from '../address/address.entity';
import * as crypto from 'crypto';
import { Length, IsEmail } from 'class-validator';

@Entity('users')
export class UsersEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Length(10, 20)
  name: string;

  @Column()
  @IsEmail()
  email: string;

  @Column()
  @Length(4, 20)
  password: string;
  // @OneToMany(type => GroupsEntity, group => group.userCretead,{cascade:true})
  // groups: GroupsEntity[];

  @OneToMany(() => AddressEntity, (address: AddressEntity) => address.author)
  addresses: AddressEntity[];

  @ManyToMany(() => GroupsEntity, (group: GroupsEntity) => group.users, {
    cascade: ['insert'],
  })
  groups: GroupsEntity[];

  @BeforeInsert()
  hashPassword() {
    this.password = crypto.createHmac('sha256', this.password).digest('hex');
  }
}
