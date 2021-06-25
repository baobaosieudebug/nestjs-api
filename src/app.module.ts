import {
  CacheInterceptor,
  CacheModule,
  HttpModule,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { UsersModule } from './user/users.module';
import { GroupsModule } from './group/group.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { TaskModule } from './task/task.module';
import { ProjectModule } from './project/project.module';
import { OrganizationModule } from './organization/organization.module';
import { CategoryModule } from './category/category.module';
import { TypeModule } from './type/type.module';
import { StatusModule } from './status/status.module';
import { VersionModule } from './version/version.module';
import { ProjectMiddleware } from './common/middleware/project.middleware';
import { StatusController } from './status/status.controller';
import { VersionController } from './version/version.controller';
import { CategoryController } from './category/category.controller';
import { TypeController } from './type/type.controller';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [
    DatabaseModule.forRoot(),
    ConfigModule.forRoot(),
    CacheModule.register({ ttl: 604800, max: 100000 }),
    UsersModule,
    GroupsModule,
    AuthModule,
    HttpModule,
    TaskModule,
    ProjectModule,
    OrganizationModule,
    CategoryModule,
    TypeModule,
    StatusModule,
    VersionModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ProjectMiddleware)
      .forRoutes(
        StatusController,
        VersionController,
        CategoryController,
        TypeController,
      );
  }
}
