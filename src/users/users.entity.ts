import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  OneToMany,
} from 'typeorm';
import { GroupsEntity } from '../group/group.entity';
import { Length, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TaskEntity } from './tasks/task.entity';

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
  @Column({ select: false })
  @Length(4, 20)
  password: string;

  @ApiProperty({ type: [GroupsEntity] })
  @ManyToMany(() => GroupsEntity, (group: GroupsEntity) => group.users, {
    cascade: ['insert'],
  })
  groups: GroupsEntity[];

  @OneToMany(() => TaskEntity, (task: TaskEntity) => task.user)
  tasks: TaskEntity[];
  // @ApiProperty({ type: [String] })
  // roles: Role[];
}
