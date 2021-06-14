import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupsController } from '../controller/group.controller';
import { GroupsService } from '../service/group.service';
import { GroupRepository } from 'src/group/repo/group.repository';

@Module({
  imports: [TypeOrmModule.forFeature([GroupRepository])],
  controllers: [GroupsController],
  providers: [GroupsService],
})
export class GroupsModule {}
