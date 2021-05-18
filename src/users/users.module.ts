import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersEntity } from './users.entity';
import { GroupsEntity } from '../group/group.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UsersEntity, GroupsEntity])],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
