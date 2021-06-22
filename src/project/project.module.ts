import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskModule } from '../task/task.module';
import { UsersModule } from '../user/users.module';
import { ProjectRepository } from './project.repository';
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
