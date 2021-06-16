import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { OrganizationRepository } from '../organization/organization.repository';
import { AddOrganizationDTO } from '../organization/dto/add-organization.dto';
import { EditOrganizationDTO } from '../organization/dto/edit-organization.dto';
import { ProjectRepository } from '../project/project.repository';
import { ProjectService } from 'src/project/project.service';

@Injectable()
export class OrganizationService {
  constructor(
    private readonly organizationRepo: OrganizationRepository,
    private readonly projectRepo: ProjectRepository,
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

  async addProject(codeIdOrg: string, codeIdProject: string) {
    const checkOrg = this.checkOrg(codeIdOrg);
    const organization = this.organizationRepo.getByCodeId(codeIdOrg);
    if ((await checkOrg) == false) {
      throw new NotFoundException('Organization CodeID Incorrect');
    } else {
      return await this.projectService.addProject(
        await organization,
        codeIdProject,
      );
    }
  }
  async checkOrg(codeId: string): Promise<boolean> {
    const organization = await this.organizationRepo.getByCodeId(codeId);
    if (!organization) {
      return false;
    }
    return true;
  }

  async editOrganization(id: number, dto: EditOrganizationDTO) {
    const organization = this.getOneByIdOrFail(id);
    try {
      return await this.organizationRepo.update((await organization).id, dto);
    } catch (e) {
      if ((await organization).id == undefined) {
        throw new NotFoundException('ID Incorrect');
      } else {
        throw new InternalServerErrorException(
          'Sorry, Server is being problem',
        );
      }
    }
  }

  async deleteOrganization(id: number) {
    const organization = this.getOneByIdOrFail(id);
    try {
      // return await this.organizationRepo.delete(await organization);
      (await organization).isDelete = (await organization).id;
      return this.organizationRepo.save(await organization);
    } catch (e) {
      if ((await organization).id == undefined) {
        throw new NotFoundException();
      } else {
        throw new InternalServerErrorException(
          'Sorry, Server is being problem',
        );
      }
    }
  }
}
