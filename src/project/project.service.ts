import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ProjectRepository } from '../project/project.repository';
import { AddProjectDTO } from '../project/dto/add-project.dto';
import { EditProjectDTO } from '../project/dto/edit-project.dto';
import { OrganizationEntity } from 'src/organization/organization.entity';

@Injectable()
export class ProjectService {
  constructor(private readonly projectRepo: ProjectRepository) {}

  async getOneById(id: number) {
    return await this.projectRepo.getById(id);
  }

  async getOneByIdOrFail(id: number) {
    if ((await this.getOneById(id)) == null) {
      throw new NotFoundException('ID Incorrect');
    } else {
      const response = await this.getOneById(id);
      return response;
    }
  }

  async getOneByCodeId(codeId: number) {
    return await this.projectRepo.getByCodeId(codeId);
  }

  async getOneByCodeIdOrFail(codeId: number) {
    const response = await this.getOneByCodeId(codeId);
    if (!response) {
      throw new NotFoundException();
    }
    return response;
  }

  async getAllProject() {
    return await this.projectRepo.getAllProject();
  }

  async createProject(dto: AddProjectDTO) {
    try {
      const project = this.projectRepo.create(dto);
      return await this.projectRepo.save(project);
    } catch (e) {
      throw new InternalServerErrorException('Sorry, Server is being problem');
    }
  }

  async addProject(organization: OrganizationEntity, codeId: string) {
    const project = await this.projectRepo.getByCodeId(codeId);
    const checkProject = this.checkProject(codeId);
    if ((await checkProject) == false) {
      throw new NotFoundException('Project CodeID Incorrect');
    } else {
      project.organization = organization;
      return await this.projectRepo.save(project);
    }
  }

  async checkProject(codeId: string): Promise<boolean> {
    const project = await this.projectRepo.getByCodeId(codeId);
    if (!project) {
      return false;
    }
    return true;
  }
  async editProject(id: number, dto: EditProjectDTO) {
    const project = this.getOneByIdOrFail(id);
    try {
      return await this.projectRepo.update((await project).id, dto);
    } catch (e) {
      if ((await project).id == undefined) {
        throw new NotFoundException('ID Incorrect');
      } else {
        throw new InternalServerErrorException(
          'Sorry, Server is being problem',
        );
      }
    }
  }

  async removeProject(id: number) {
    const project = this.getOneByIdOrFail(id);
    try {
      // return await this.projectRepo.delete(await project);
      (await project).isDelete = (await project).id;
      return this.projectRepo.save(await project);
    } catch (e) {
      if ((await project).id == undefined) {
        throw new NotFoundException();
      } else {
        throw new InternalServerErrorException(
          'Sorry, Server is being problem',
        );
      }
    }
  }
}
