import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VersionRepository } from './version.repository';
import { VersionService } from './version.service';
import { VersionController } from './version.controller';
import { ProjectModule } from '../project/project.module';
import { ProjectMiddleware } from '../common/middleware/project.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([VersionRepository]), ProjectModule],
  providers: [VersionService],
  controllers: [VersionController],
  exports: [VersionService],
})
export class VersionModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ProjectMiddleware).forRoutes(VersionController);
  }
}
