import { HttpModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserRepository } from './user.repository';
import { GroupsModule } from '../group/group.module';
import { TaskModule } from 'src/task/task.module';
import { ProjectModule } from '../project/project.module';
// import { APP_GUARD } from '@nestjs/core';
// import { RolesGuard } from '../authorization/role.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRepository]),
    HttpModule,
    TaskModule,
    GroupsModule,
    ProjectModule,
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    // {
    //   provide: APP_GUARD,
    //   useClass: RolesGuard,
    // },
  ],
  exports: [UsersService, TypeOrmModule],
})
export class UsersModule {}
