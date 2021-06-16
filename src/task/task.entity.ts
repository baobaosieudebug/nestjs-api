import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { UsersEntity } from 'src/user/users.entity';

@Entity('task')
export class TaskEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column({ type: 'varchar' })
  name: string;

  @ApiProperty()
  @Column({ type: 'varchar' })
  codeId: string;

  @Column({ name: 'is_delete', type: 'varchar', default: null })
  isDelete: number;

  @ManyToOne(() => UsersEntity, (user: UsersEntity) => user.tasks)
  user: UsersEntity;
}
