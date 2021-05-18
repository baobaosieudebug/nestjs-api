import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { UsersEntity } from '../users/users.entity';

@Entity('address')
export class AddressEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nameAddress: string;

  @ManyToOne(() => UsersEntity, (author: UsersEntity) => author.addresses)
  public author: UsersEntity;
}
