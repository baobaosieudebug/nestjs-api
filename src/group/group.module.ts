import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupsController } from './group.controller';
import { GroupsService } from './group.service';
import { GroupRepository } from 'src/group/group.repository';

@Module({
  imports: [TypeOrmModule.forFeature([GroupRepository])],
  controllers: [GroupsController],
  providers: [GroupsService],
  exports: [GroupsService, TypeOrmModule],
})
export class GroupsModule {}
