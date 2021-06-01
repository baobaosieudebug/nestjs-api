import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import { GroupsEntity } from '../group/group.entity';
import { AddressEntity } from './address/address.entity';
import * as crypto from 'crypto';
import { Length, IsEmail } from 'class-validator';
import { Role } from 'src/auth/roles/role.enum';
import { ApiProperty } from '@nestjs/swagger';

@Entity('users')
export class UsersEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  @Length(10, 20)
  name: string;

  @ApiProperty()
  @Column()
  @IsEmail()
  email: string;

  @ApiProperty()
  @Column()
  @Length(4, 20)
  password: string;

  @ApiProperty()
  @Column()
  isAdmin: boolean;

  @ApiProperty({ type: [AddressEntity] })
  @OneToMany(() => AddressEntity, (address: AddressEntity) => address.author)
  addresses: AddressEntity[];

  @ApiProperty({ type: [GroupsEntity] })
  @ManyToMany(() => GroupsEntity, (group: GroupsEntity) => group.users, {
    cascade: ['insert'],
  })
  groups: GroupsEntity[];

  @ApiProperty({ type: [String] })
  roles: Role[];
}
