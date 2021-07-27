import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupsController } from './group.controller';
import { GroupsService } from './group.service';
import { GroupRepository } from './group.repository';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([GroupRepository]), forwardRef(() => UserModule)],
  controllers: [GroupsController],
  providers: [GroupsService],
  exports: [GroupsService, TypeOrmModule],
})
export class GroupsModule {}
