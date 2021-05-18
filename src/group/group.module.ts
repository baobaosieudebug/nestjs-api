import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupsController } from './group.controller';
import { GroupsService } from './group.service';
import { GroupsEntity } from './group.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GroupsEntity])],
  controllers: [GroupsController],
  providers: [GroupsService],
})
export class GroupsModule {}
