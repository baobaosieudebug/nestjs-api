import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { UsersEntity } from '../users.entity';
// import { UsersEntity } from '../users/users.entity';

@Entity('address')
export class AddressEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  street: string;

  @Column()
  ward: string;

  @Column()
  district: string;

  @Column('varchar', { name: 'city', nullable: true })
  city: string;

  @ManyToOne(() => UsersEntity, (author: UsersEntity) => author.addresses)
  userId: UsersEntity;
}
