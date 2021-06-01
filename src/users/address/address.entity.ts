import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { UsersEntity } from '../users.entity';

@Entity('address')
export class AddressEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  nameAddress: string;

  @ApiProperty()
  @Column()
  ward: string;

  @ApiProperty()
  @Column()
  district: string;

  @ApiProperty()
  @Column()
  city: string;

  @ApiProperty({ type: () => UsersEntity })
  @ManyToOne(() => UsersEntity, (author: UsersEntity) => author.addresses)
  author: UsersEntity;
}
