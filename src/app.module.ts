import { CacheInterceptor, CacheModule, HttpModule, Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
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
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [
    DatabaseModule.forRoot(),
    ConfigModule.forRoot(),
    CacheModule.register({ ttl: 604800, max: 100000 }),
    UserModule,
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
export class AppModule {}
