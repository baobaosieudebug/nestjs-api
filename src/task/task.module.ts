import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskController } from './task.controller';
import { TaskRepository } from './task.respository';
import { TaskService } from './task.service';
import { OrganizationModule } from '../organization/organization.module';
import { ProjectModule } from '../project/project.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TaskRepository]),
    OrganizationModule,
    forwardRef(() => ProjectModule),
    AuthModule,
  ],
  providers: [TaskService],
  controllers: [TaskController],
  exports: [TaskService, TypeOrmModule],
})
export class TaskModule {}
