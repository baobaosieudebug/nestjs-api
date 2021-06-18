import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskModule } from 'src/task/task.module';
import { UsersModule } from 'src/user/users.module';
import { ProjectRepository } from '../project/project.repository';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProjectRepository]),
    UsersModule,
    TaskModule,
  ],
  providers: [ProjectService],
  controllers: [ProjectController],
  exports: [ProjectService, TypeOrmModule],
})
export class ProjectModule {}
