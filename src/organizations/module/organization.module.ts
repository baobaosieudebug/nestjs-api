import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrganizationRepository } from 'src/organizations/repo/organization.repository';
import { ProjectModule } from 'src/projects/module/project.module';
import { OrganizationController } from '../controller/organization.controller';
import { OrganizationService } from '../service/organization.service';

@Module({
  imports: [TypeOrmModule.forFeature([OrganizationRepository]), ProjectModule],
  providers: [OrganizationService],
  controllers: [OrganizationController],
  exports: [OrganizationService],
})
export class OrganizationModule {}
