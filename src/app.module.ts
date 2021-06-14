import { HttpModule, Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { GroupsModule } from './group/group.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from './config/config.module';
import { DatabaseModule } from './database/database.module';
import { TaskModule } from './tasks/task.module';
import { ProjectModule } from './projects/project.module';
import { OrganizationModule } from './organizations/module/organization.module';

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
