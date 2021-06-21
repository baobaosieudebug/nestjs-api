import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { OrganizationRepository } from '../organization/organization.repository';
import { AddOrganizationDTO } from '../organization/dto/add-organization.dto';
import { EditOrganizationDTO } from '../organization/dto/edit-organization.dto';
import { ProjectService } from 'src/project/project.service';

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
    const responseEntity = await this.getOneByCodeId(codeId);
    if (!responseEntity) {
      throw new NotFoundException();
    }
    return responseEntity;
  }

  async createOrganization(dto: AddOrganizationDTO) {
    try {
      const organization = this.organizationRepo.create(dto);
      return await this.organizationRepo.save(organization);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async addProject(codeIdOrg: string, codeIdProject: string) {
    const checkOrg = this.checkOrg(codeIdOrg);
    if ((await checkOrg) == false) {
      throw new NotFoundException();
    }
    const org = this.organizationRepo.getByCodeId(codeIdOrg);
    return await this.projectService.addProject(await org, codeIdProject);
  }
  async checkOrg(codeId: string): Promise<boolean> {
    const organization = await this.getOneByCodeIdOrFail(codeId);
    if (!organization) {
      return false;
    }
    return true;
  }

  async checkOrgID(id: number): Promise<boolean> {
    const organization = await this.getOneByIdOrFail(id);
    if (!organization) {
      return false;
    }
    return true;
  }

  async editOrganization(id: number, dto: EditOrganizationDTO) {
    const checkOrg = this.checkOrgID(id);
    if ((await checkOrg) == false) {
      throw new NotFoundException();
    }
    try {
      return await this.organizationRepo.update(id, dto);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async removeOrganization(id: number) {
    const checkOrg = this.checkOrgID(id);
    if ((await checkOrg) == false) {
      throw new NotFoundException();
    }
    try {
      const organization = this.getOneById(id);
      (await organization).isDelete = (await organization).id;
      return this.organizationRepo.save(await organization);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async removeProject(codeId: string, codeIdProject: string) {
    const checkOrg = this.checkOrg(codeId);//
    if ((await checkOrg) == false) {
      throw new NotFoundException();
    }
    const org = this.organizationRepo.getByCodeId(codeId);
    const filtered = (await org).projects.filter(
      (res) => res.codeId != codeIdProject,
    );
    (await org).projects = filtered;
    return await this.organizationRepo.save(await org);
  }
}
