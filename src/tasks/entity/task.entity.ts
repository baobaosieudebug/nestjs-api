import { Length } from 'class-validator';
import {
  Column,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { UsersEntity } from 'src/users/entity/users.entity';
import { GroupsEntity } from 'src/group/entity/group.entity';

@Entity('task')
export class TaskEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  @Length(10, 20)
  name: string;

  @ApiProperty()
  @Column()
  @Length(10, 20)
  codeId: string;

  @Column({ default: null })
  @Length(10, 20)
  isDelete: string;

  @DeleteDateColumn()
  deletedAt?: number;

  @ManyToOne(() => UsersEntity, (user: UsersEntity) => user.tasks)
  user: UsersEntity;

  @ManyToOne(() => GroupsEntity, (group: GroupsEntity) => group.tasks)
  group: GroupsEntity;
}
