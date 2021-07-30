import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskModule } from '../task/task.module';
import { UserModule } from '../user/user.module';
import { ProjectRepository } from './project.repository';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { JwtModule } from '@nestjs/jwt';
import { OrganizationModule } from '../organization/organization.module';
import { RoleRepository } from '../auth/repository/role.repository';
import { AuthModule } from '../auth/auth.module';
import { ResourceRepository } from '../auth/repository/resource.repository';
import { ActionRepository } from '../auth/repository/action.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProjectRepository, RoleRepository, ResourceRepository, ActionRepository]),
    forwardRef(() => UserModule),
    forwardRef(() => TaskModule),
    forwardRef(() => OrganizationModule),
    AuthModule,
    JwtModule.register({
      secret: 'SECRET',
      signOptions: { expiresIn: '60s' },
    }),
  ],
  providers: [ProjectService],
  controllers: [ProjectController],
  exports: [ProjectService, TypeOrmModule],
})
export class ProjectModule {}
