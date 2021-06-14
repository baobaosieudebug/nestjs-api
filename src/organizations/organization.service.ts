import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { getCustomRepository } from 'typeorm';
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
    return await this.organizationRepo.getById(id);
  }

  async getOneByIdOrFail(id: number) {
    if ((await this.getOneById(id)) == null) {
      throw new HttpException('Organization not found', HttpStatus.NOT_FOUND);
    } else {
      const response = await this.getOneById(id);
      return response;
    }
  }

  async restoreOganization(id: number) {
    const organization = this.organizationRepo.getByIdWithDelete(id);
    await this.organizationRepo.restore(await organization);
    return new HttpException('Restore Successfully!', HttpStatus.OK);
  }

  async createOrganization(organazation: AddOrganizationDTO) {
    await this.organizationRepo.save(organazation);
    return new HttpException('Add Organization Success', HttpStatus.OK);
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
    return new HttpException('Update Organization Success', HttpStatus.OK);
  }

  async softDelete(id: number) {
    const organization = this.organizationRepo.getByIdWithDelete(id);
    await this.organizationRepo.softDelete(await organization);
    return new HttpException('Delete Successfully!', HttpStatus.OK);
  }

  async removeOrganization(id: number) {
    const user = this.getOneByIdOrFail(id);
    await this.organizationRepo.delete((await user).id);
    return new HttpException('Delete Successfully!', HttpStatus.OK);
  }
}
