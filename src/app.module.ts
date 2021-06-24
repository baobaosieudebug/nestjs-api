import { HttpModule, Module } from '@nestjs/common';
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

@Module({
  imports: [
    DatabaseModule.forRoot(),
    ConfigModule.forRoot(),
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
})
export class AppModule {}
