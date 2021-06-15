import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { UsersEntity } from 'src/users/entity/users.entity';
import { GroupsEntity } from 'src/group/entity/group.entity';

@Entity('task')
export class TaskEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @ApiProperty()
  @Column({ type: 'varchar', length: 255 })
  codeId: string;

  @Column({ type: 'varchar', length: 255, default: null })
  isDelete: number;

  @ManyToOne(() => UsersEntity, (user: UsersEntity) => user.tasks)
  user: UsersEntity;

  @ManyToOne(() => GroupsEntity, (group: GroupsEntity) => group.tasks)
  group: GroupsEntity;
}
