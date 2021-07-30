import { forwardRef, HttpModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserRepository } from './repository/user.repository';
import { GroupsModule } from '../group/group.module';
import { TaskModule } from 'src/task/task.module';
import { ProjectModule } from '../project/project.module';
import { OrganizationModule } from '../organization/organization.module';
import { MailModule } from '../mail/mail.module';
import { UserOrganizationRepository } from './repository/user-organization.repository';
import { UserProjectRepository } from './repository/user-project.repository';
import { UserRoleRepository } from './repository/user-role.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRepository, UserOrganizationRepository, UserProjectRepository, UserRoleRepository]),
    HttpModule,
    TaskModule,
    GroupsModule,
    forwardRef(() => ProjectModule),
    forwardRef(() => OrganizationModule),
    MailModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService, TypeOrmModule],
})
export class UserModule {}
