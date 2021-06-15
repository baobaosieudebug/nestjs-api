import { HttpModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from '../controller/users.controller';
import { UsersService } from '../service/users.service';
import { UserRepository } from 'src/users/repo/user.repository';
import { TaskModule } from 'src/tasks/module/task.module';
import { GroupsModule } from 'src/group/module/group.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRepository]),
    HttpModule,
    // TaskModule,
    GroupsModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
