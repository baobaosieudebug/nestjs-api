import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupsController } from './group.controller';
import { GroupsService } from './group.service';
import { GroupRepository } from './group.repository';
import { UsersModule } from '../user/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([GroupRepository]), forwardRef(() => UsersModule)],
  controllers: [GroupsController],
  providers: [GroupsService],
  exports: [GroupsService, TypeOrmModule],
})
export class GroupsModule {}
