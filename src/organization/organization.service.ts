import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { OrganizationRepository } from './organization.repository';
import { AddOrganizationDTO } from './dto/add-organization.dto';
import { EditOrganizationDTO } from './dto/edit-organization.dto';
import { ProjectService } from '../project/project.service';

@Injectable()
export class OrganizationService {
  constructor(
    private readonly organizationRepo: OrganizationRepository,
    private readonly projectService: ProjectService,
  ) {}
  async getAllOrganization() {
    return await this.organizationRepo.getAllOrganization();
  }

  async getOneById(id: number) {
    return await this.organizationRepo.getById(id);
  }

  async getOneByIdOrFail(id: number) {
    const response = await this.getOneById(id);
    if (!response) {
      throw new NotFoundException();
    }
    return response;
  }

  getOneByCodeId(codeId: string) {
    return this.organizationRepo.getByCodeId(codeId);
  }

  async getOneByCodeIdOrFail(codeId: string) {
    const response = await this.getOneByCodeId(codeId);
    if (!response) {
      throw new NotFoundException();
    }
    return response;
  }

  async createOrganization(dto: AddOrganizationDTO) {
    const checkOrg = await this.checkOrgByCode(dto.code);
    if (checkOrg) {
      throw new NotFoundException('Code must be unique');
    }
    try {
      const newOrg = this.organizationRepo.create(dto);
      return await this.organizationRepo.save(newOrg);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async addProject(codeOrg: string, codeProject: string) {
    const checkOrg = await this.checkOrgByCode(codeOrg);
    if (!checkOrg) {
      throw new NotFoundException();
    }
    try {
      return await this.projectService.addProject(checkOrg.id, codeProject);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
  async checkOrgByCode(codeId: string) {
    const organization = await this.getOneByCodeIdOrFail(codeId);
    if (!organization) {
      return null;
    }
    return organization;
  }

  async checkOrgByID(id: number) {
    const organization = await this.getOneByIdOrFail(id);
    if (!organization) {
      return null;
    }
    return organization;
  }

  async editOrganization(id: number, dto: EditOrganizationDTO) {
    const checkOrg = this.checkOrgByID(id);
    if (!checkOrg) {
      throw new NotFoundException('Organization Not Found');
    }
    const existCode = this.organizationRepo.getByCodeId(dto.codeId);
    if (existCode) {
      throw new NotFoundException('Code must be unique');
    }
    try {
      return await this.organizationRepo.update(id, dto);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
  async checkDeleted(id: number) {
    const org = this.organizationRepo.getByIdWithDelete(id);
    if (!org) {
      return null;
    }
    return org;
  }
  async removeOrganization(id: number) {
    const checkOrg = await this.checkOrgByID(id);
    if (!checkOrg) {
      throw new NotFoundException('Project Not Found');
    }
    const existDelete = await this.checkDeleted(id);
    if (existDelete) {
      throw new NotFoundException('Org Deleted');
    }
    try {
      return this.organizationRepo.update(id, { isDeleted: id });
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async removeProject(codeId: string, codeIdProject: string) {
    const checkOrg = await this.checkOrgByCode(codeId);
    if (!checkOrg) {
      throw new NotFoundException();
    }
    try {
      checkOrg.projects = checkOrg.projects.filter(
        (res) => res.code != codeIdProject,
      );
      return await this.organizationRepo.save(checkOrg);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
}
