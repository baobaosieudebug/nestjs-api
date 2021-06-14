import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ProjectRepository } from 'src/projects/repo/project.repository';
import { AddProjectDTO } from 'src/projects/dto/add-project.dto';
import { EditProjectDTO } from 'src/projects/dto/edit-project.dto';
import { getCustomRepository } from 'typeorm';
import { GroupRepository } from 'src/group/repo/group.repository';

@Injectable()
export class ProjectService {
  constructor(private readonly projectRepo: ProjectRepository) {}

  //   userRepo = getCustomRepository(UserRepository);
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
    if ((await this.getOneByCodeId(codeId)) == null) {
      throw new HttpException('Project not found', HttpStatus.NOT_FOUND);
    } else {
      const response = await this.getOneByCodeId(codeId);
      return response;
    }
  }

  async getAllProject() {
    return await this.projectRepo.getAllProject();
  }

  async createProject(project: AddProjectDTO) {
    const newProject = await this.projectRepo.create(project);
    return await this.projectRepo.save(newProject);
  }

  async addGroup(codeId, idGroup) {
    const project = this.projectRepo.getByCodeId(codeId);
    const group = this.groupRepo.getById(idGroup);
    (await group).projects.push(await project);
    await this.groupRepo.save(await group);
    return new HttpException('Add Group Success', HttpStatus.OK);
  }

  async editProject(project: EditProjectDTO) {
    const findProject = this.projectRepo.getByCodeId(project.codeId);
    await this.projectRepo.update((await findProject).id, project);
  }

  async removeProject(id: number) {
    const user = this.getOneByIdOrFail(id);
    await this.projectRepo.delete((await user).id);
    return new HttpException('Delete Successfully!', HttpStatus.OK);
  }
}
