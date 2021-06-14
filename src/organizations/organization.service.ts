import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateArticleDTO } from 'src/dto/add-article.dto';
import { getCustomRepository, Repository } from 'typeorm';
import { OrganizationEntity } from './organization.entity';
import { EditArticleDTO } from '../dto/edit-article.dto';
import { OrganizationRepository } from 'src/repo/organazation.repositor';
import { AddOrganizationDTO } from 'src/dto/add-organization.dto';
import { EditOrganizationDTO } from 'src/dto/edit-organization.dto';
import { ProjectRepository } from 'src/repo/project.repository';

@Injectable()
export class OrganizationService {
  constructor(private readonly organizationRepo: OrganizationRepository) {}
  projectRepo = getCustomRepository(ProjectRepository);
  async getAllOrganization() {
    return await this.organizationRepo.getAllOrganization();
  }

  async getOneById(id: number) {
    return await this.organizationRepo.getByCodeId(id);
  }

  async getOneByIdOrFail(id: number) {
    if ((await this.getOneById(id)) == null) {
      throw new HttpException('Organization not found', HttpStatus.NOT_FOUND);
    } else {
      const response = await this.getOneById(id);
      return response;
    }
  }

  async createOrganization(organazation: AddOrganizationDTO) {
    await this.organizationRepo.save(organazation);
    return new HttpException('Add Organization Sucess', HttpStatus.OK);
  }

  async addProject(codeIdOrga: number, codeIdProject: number) {
    const organazation = await this.organizationRepo.getByCodeId(codeIdOrga);
    const project = await this.projectRepo.getByCodeId(codeIdProject);
    project.organization = organazation;
    await this.projectRepo.save(project);
    return new HttpException('Add Project Success', HttpStatus.OK);
  }

  async editOrganization(organization: EditOrganizationDTO) {
    const findOrganization = this.organizationRepo.getByCodeId(
      organization.codeId,
    );
    await this.organizationRepo.update(
      (
        await findOrganization
      ).id,
      organization,
    );
    return new HttpException('Update Organization Sucess', HttpStatus.OK);
  }

  async removeOrganization(id: number) {
    const user = this.getOneByIdOrFail(id);
    await this.organizationRepo.delete((await user).id);
    return new HttpException('Delete Successfully!', HttpStatus.OK);
  }
}
