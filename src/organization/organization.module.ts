import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationRepository } from './organization.repository';
import { ProjectModule } from '../project/project.module';
import { OrganizationController } from './organization.controller';
import { OrganizationService } from './organization.service';
import { UsersModule } from '../user/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([OrganizationRepository]), ProjectModule, UsersModule],
  providers: [OrganizationService],
  controllers: [OrganizationController],
  exports: [OrganizationService],
})
export class OrganizationModule {}
