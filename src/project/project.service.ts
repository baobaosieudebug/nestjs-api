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
      throw new InternalServerErrorException();
    }
  }

  async addProject(organization: OrganizationEntity, codeId: string) {
    const checkProject = this.checkProject(codeId);
    if ((await checkProject) == false) {
      throw new NotFoundException();
    }
    const project = await this.projectRepo.getByCodeId(codeId);
    project.organization = organization;
    return await this.projectRepo.save(project);
  }

  async checkProject(codeId: string): Promise<boolean> {
    const project = await this.projectRepo.getByCodeId(codeId);
    if (!project) {
      return false;
    }
    return true;
  }

  async checkProjectID(id: number): Promise<boolean> {
    const project = await this.projectRepo.getById(id);
    if (!project) {
      return false;
    }
    return true;
  }

  async editProject(id: number, dto: EditProjectDTO) {
    const checkProject = this.checkProjectID(id);
    if ((await checkProject) == false) {
      throw new NotFoundException();
    }
    try {
      return await this.projectRepo.update(id, dto);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async removeProject(id: number) {
    const checkProject = this.checkProjectID(id);
    if ((await checkProject) == false) {
      throw new NotFoundException();
    }
    try {
      const project = this.getOneById(id);
      (await project).isDelete = (await project).id;
      return this.projectRepo.save(await project);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
}
