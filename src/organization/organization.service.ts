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
    return await this.organizationRepo.getAll();
  }

  async getOneById(id: number) {
    return await this.organizationRepo.getById(id);
  }

  async getOneByIdOrFail(id: number) {
    const response = await this.getOneById(id);
    if (!response) {
      throw new NotFoundException('Organization not found');
    }
    return response;
  }

  getOneByCode(code: string) {
    return this.organizationRepo.getByCode(code);
  }

  async getOneByCodeOrFail(code: string) {
    const response = await this.getOneByCode(code);
    if (!response) {
      throw new NotFoundException('Organization not found');
    }
    return response;
  }

  async getAllProjectById(id: number) {
    const checkExist = await this.getOneByIdOrFail(id);
    if (checkExist) {
      try {
        return await this.projectService.getAllProjectByIdOrg(id);
      } catch (e) {
        throw new InternalServerErrorException();
      }
    }
  }

  async createOrganization(dto: AddOrganizationDTO) {
    const checkOrg = await this.checkOrgByCode(dto.code);
    if (!checkOrg) {
      try {
        const newOrg = this.organizationRepo.create(dto);
        return await this.organizationRepo.save(newOrg);
      } catch (e) {
        throw new InternalServerErrorException();
      }
    }
  }

  async addProject(codeOrg: string, codeProject: string) {
    const checkExist = await this.getOneByCodeOrFail(codeOrg);
    if (checkExist) {
      try {
        return this.projectService.addProject(checkExist.id, codeProject);
      } catch (e) {
        throw new InternalServerErrorException();
      }
    }
  }

  async checkOrgByCode(code: string) {
    const organization = await this.organizationRepo.isOrgExistCode(code);
    if (organization) {
      throw new NotFoundException('Organization Exist');
    }
    return organization;
  }

  async editOrganization(id: number, dto: EditOrganizationDTO) {
    const checkOrg = this.checkOrgByCode(dto.code);
    if (!checkOrg) {
      try {
        return await this.organizationRepo.update(id, dto);
      } catch (e) {
        throw new InternalServerErrorException();
      }
    }
  }

  async removeOrganization(id: number) {
    const checkExist = await this.getOneByIdOrFail(id);
    if (checkExist) {
      try {
        return this.organizationRepo.update(id, { isDeleted: id });
      } catch (e) {
        throw new InternalServerErrorException();
      }
    }
  }

  async removeProject(code: string, codeProject: string) {
    const checkExist = await this.getOneByCodeOrFail(code);
    if (checkExist) {
      try {
        return this.projectService.removeProject(checkExist.id, codeProject);
      } catch (e) {
        throw new InternalServerErrorException();
      }
    }
  }
}
