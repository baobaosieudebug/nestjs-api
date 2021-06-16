import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { UsersEntity } from '../user/entity/users.entity';

@Entity('groups')
export class GroupsEntity {
  @ApiProperty({ type: String, example: '1' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ type: String, example: 'NodeJs' })
  @Column({ type: 'varchar', length: 255 })
  nameGroup: string;

  @ApiProperty({ type: [UsersEntity] })
  @ManyToMany(() => UsersEntity, (user: UsersEntity) => user.groups, {
    cascade: ['insert'],
  })
  @JoinTable()
  users: UsersEntity[];
}
