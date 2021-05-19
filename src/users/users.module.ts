import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersEntity } from './users.entity';
import { GroupsEntity } from '../group/group.entity';
import { AddressService } from './address/address.service';
import { AddressModule } from './address/address.module';
import { AddressEntity } from './address/address.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UsersEntity]), AddressModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
