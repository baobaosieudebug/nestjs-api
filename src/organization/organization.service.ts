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

@Injectable()
export class OrganizationService {
  constructor(
    private readonly organizationRepo: OrganizationRepository,
    private readonly projectRepo: ProjectRepository,
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

  async addProject(codeIdOrga: number, codeIdProject: number) {
    const organization = await this.organizationRepo.getByCodeId(codeIdOrga);
    const project = await this.projectRepo.getByCodeId(codeIdProject);
    project.organization = organization;
    return await this.projectRepo.save(project);
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
