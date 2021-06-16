import { HttpModule, Module } from '@nestjs/common';
import { UsersModule } from './user/module/users.module';
import { GroupsModule } from './group/group.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { TaskModule } from './task/module/task.module';
import { ProjectModule } from './project/project.module';
import { OrganizationModule } from './organization/organization.module';

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
  ],
})
export class AppModule {}
