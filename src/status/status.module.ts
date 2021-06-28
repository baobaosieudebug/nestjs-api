import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatusRepository } from './status.repository';
import { StatusService } from './status.service';
import { StatusController } from './status.controller';
import { ProjectModule } from '../project/project.module';
import { ProjectMiddleware } from '../common/middleware/project.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([StatusRepository]), ProjectModule],
  providers: [StatusService],
  controllers: [StatusController],
  exports: [StatusService],
})
export class StatusModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ProjectMiddleware).forRoutes(StatusController);
  }
}
