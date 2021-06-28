import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeRepository } from './type.repository';
import { TypeService } from './type.service';
import { TypeController } from './type.controller';
import { ProjectModule } from '../project/project.module';
import { ProjectMiddleware } from '../common/middleware/project.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([TypeRepository]), ProjectModule],
  providers: [TypeService],
  controllers: [TypeController],
  exports: [TypeService],
})
export class TypeModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ProjectMiddleware).forRoutes(TypeController);
  }
}
