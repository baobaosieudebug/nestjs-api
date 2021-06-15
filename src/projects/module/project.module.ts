import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectRepository } from 'src/projects/repo/project.repository';
import { ProjectController } from '../controller/project.controller';
import { ProjectService } from '../service/project.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectRepository])],
  providers: [ProjectService],
  controllers: [ProjectController],
  exports: [ProjectService, TypeOrmModule],
})
export class ProjectModule {}
