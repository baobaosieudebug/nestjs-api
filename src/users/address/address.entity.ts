import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { UsersEntity } from '../users.entity';

@Entity('address')
export class AddressEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ward: string;

  @Column()
  nameAddress: string;

  @Column()
  district: string;

  @Column()
  city: string;

  @ManyToOne(() => UsersEntity, (author: UsersEntity) => author.addresses)
  author: UsersEntity;
}
