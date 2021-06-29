import {
  BadRequestException,
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
    return await this.organizationRepo.getAll();
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

  getOneByCode(code: string) {
    return this.organizationRepo.getByCode(code);
  }

  async getOneByCodeOrFail(code: string) {
    const response = await this.getOneByCode(code);
    if (!response) {
      throw new NotFoundException();
    }
    return response;
  }

  async getAllProjectByID(id: number) {
    const checkOrg = await this.checkOrgByID(id);
    if (!checkOrg) {
      throw new NotFoundException();
    }
    try {
      return await this.projectService.getAllProjectByIDOrg(id);
    } catch (e) {
      throw new InternalServerErrorException();
    }
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
      return this.projectService.addProject(checkOrg.id, codeProject);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
  async checkOrgByCode(code: string) {
    const organization = await this.organizationRepo.getByCode(code);
    if (!organization) {
      throw new NotFoundException('Organization not found');
    }
    return organization;
  }

  async checkOrgByID(id: number) {
    const organization = await this.organizationRepo.getById(id);
    if (!organization) {
      throw new NotFoundException('Organization not found');
    }
    return organization;
  }

  async editOrganization(id: number, dto: EditOrganizationDTO) {
    const checkOrg = this.checkOrgByID(id);
    if (!checkOrg) {
      throw new NotFoundException('Organization Not Found');
    }
    const existCode = this.organizationRepo.getByCode(dto.code);
    if (existCode) {
      throw new NotFoundException('Code must be unique');
    }
    try {
      return await this.organizationRepo.update(id, dto);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }


  async removeOrganization(id: number) {
    const checkOrg = await this.checkOrgByID(id);
    if (!checkOrg) {
      throw new NotFoundException('Org Not Found');
    }
    try {
      return this.organizationRepo.update(id, { isDeleted: id });
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async removeProject(code: string, codeProject: string) {
    const checkOrg = await this.organizationRepo.getByCode(code);
    if (!checkOrg) {
      throw new NotFoundException();
    }
    try {
      return this.projectService.removeProject(checkOrg.id, codeProject);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
}
