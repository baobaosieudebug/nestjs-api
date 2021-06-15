import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskRepository } from 'src/tasks/repo/task.respository';
import { TaskController } from '../controller/task.controller';
import { TaskService } from '../service/task.service';

@Module({
  imports: [TypeOrmModule.forFeature([TaskRepository])],
  providers: [TaskService],
  controllers: [TaskController],
  exports: [TaskService],
})
export class TaskModule {}
