import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatusRepository } from './status.repository';
import { StatusService } from './status.service';
import { StatusController } from './status.controller';
import { ProjectModule } from '../project/project.module';

@Module({
  imports: [TypeOrmModule.forFeature([StatusRepository]), ProjectModule],
  providers: [StatusService],
  controllers: [StatusController],
  exports: [StatusService],
})
export class StatusModule {}
