import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ProjectRepository } from 'src/projects/repo/project.repository';
import { AddProjectDTO } from 'src/projects/dto/add-project.dto';
import { EditProjectDTO } from 'src/projects/dto/edit-project.dto';
import { getCustomRepository } from 'typeorm';
import { GroupRepository } from 'src/group/repo/group.repository';

@Injectable()
export class ProjectService {
  constructor(private readonly projectRepo: ProjectRepository) {}
  groupRepo = getCustomRepository(GroupRepository);

  async getOneById(id: number) {
    return await this.projectRepo.getById(id);
  }

  async getOneByIdOrFail(id: number) {
    if ((await this.getOneById(id)) == null) {
      throw new HttpException('Project not found', HttpStatus.NOT_FOUND);
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
      throw new HttpException('Project not found', HttpStatus.NOT_FOUND);
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

  async addGroup(codeId, idGroup) {
    const project = this.projectRepo.getByCodeId(codeId);
    const group = this.groupRepo.getById(idGroup);
    (await group).projects.push(await project);
    await this.groupRepo.save(await group);
    return new HttpException('Add Group Success', HttpStatus.OK);
  }

  async editProject(dto: EditProjectDTO) {
    try {
      const project = this.projectRepo.getByCodeId(dto.codeId);
      return await this.projectRepo.update((await project).id, await project);
    } catch (e) {
      throw new InternalServerErrorException('Sorry, Server is being problem');
    }
  }

  async removeProject(id: number) {
    try {
      const user = this.getOneByIdOrFail(id);
      return await this.projectRepo.delete((await user).id);
    } catch (e) {
      throw new InternalServerErrorException('Sorry, Server is being problem');
    }
  }
}
