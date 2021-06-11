import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ProjectRepository } from 'src/repo/project.repository';
import { AddProjectDTO } from 'src/dto/add-project.dto';
import { EditProjectDTO } from 'src/dto/edit-project.dto';

@Injectable()
export class ProjectService {
  constructor(private readonly projectRepo: ProjectRepository) {}

  //   userRepo = getCustomRepository(UserRepository);
  //   groupRepo = getCustomRepository(GroupRepository);

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

  async getAllProject() {
    return await this.projectRepo.getAllProject();
  }

  //   async getAllProjectByIdGroup(idGroup) {
  //     return this.ProjectRepo.getAllProjectByIdGroup(idGroup);
  //   }

  async createProject(project: AddProjectDTO) {
    const newProject = await this.projectRepo.create(project);
    return await this.projectRepo.save(newProject);
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
