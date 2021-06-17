import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from 'src/user/users.module';
import { ProjectRepository } from '../project/project.repository';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectRepository]), UsersModule],
  providers: [ProjectService],
  controllers: [ProjectController],
  exports: [ProjectService, TypeOrmModule],
})
export class ProjectModule {}
