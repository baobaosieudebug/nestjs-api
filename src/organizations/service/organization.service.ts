import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { getCustomRepository } from 'typeorm';
import { OrganizationRepository } from 'src/organizations/repo/organization.repositor';
import { AddOrganizationDTO } from 'src/organizations/dto/add-organization.dto';
import { EditOrganizationDTO } from 'src/organizations/dto/edit-organization.dto';
import { ProjectRepository } from 'src/projects/repo/project.repository';

@Injectable()
export class OrganizationService {
  constructor(private readonly organizationRepo: OrganizationRepository) {}
  projectRepo = getCustomRepository(ProjectRepository);
  async getAllOrganization() {
    return await this.organizationRepo.getAllOrganization();
  }

  async getOneById(id: number) {
    return await this.organizationRepo.getById(id);
  }

  async getOneByIdOrFail(id: number) {
    const response = await this.getOneById(id);
    if (!response) {
      throw new HttpException('Organization Not Found', HttpStatus.NOT_FOUND);
    }
    return response;
  }

  async createOrganization(dto: AddOrganizationDTO) {
    try {
      const organization = this.organizationRepo.create(dto);
      return await this.organizationRepo.save(organization);
    } catch (e) {
      throw new InternalServerErrorException('Sorry, Server is being problem');
    }
  }

  async addProject(codeIdOrga: number, codeIdProject: number) {
    const organization = await this.organizationRepo.getByCodeId(codeIdOrga);
    const project = await this.projectRepo.getByCodeId(codeIdProject);
    project.organization = organization;
    await this.projectRepo.save(project);
    return new HttpException('Add Project Success', HttpStatus.OK);
  }

  async editOrganization(dto: EditOrganizationDTO) {
    try {
      const organization = this.organizationRepo.getByCodeId(dto.codeId);
      return await this.organizationRepo.update((await organization).id, dto);
    } catch (e) {
      throw new InternalServerErrorException('Sorry, Server is being problem');
    }
  }

  async deleteOrganization(id: number) {
    try {
      // const organization = this.organizationRepo.getByIdWithDelete(id);
      return await this.organizationRepo.delete(id);
    } catch (e) {
      throw new InternalServerErrorException('Sorry, Server is being problem');
    }
  }
}
