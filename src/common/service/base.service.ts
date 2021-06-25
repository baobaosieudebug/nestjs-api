import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { ProjectService } from '../../project/project.service';

export class BaseService<childRepo> {
  constructor(
    private repo: Repository<childRepo>,
    private serviceProject: ProjectService,
  ) {}

  getAll(idProject: number) {
    return this.repo.find({ where: { projectID: idProject } });
  }

  getOneById(id: number): Promise<childRepo> {
    return this.repo.findOne(id);
  }

  async getOneByIdOrFail(id: number, idProject: number): Promise<childRepo> {
    const checkProject = this.serviceProject.checkProjectByID(idProject);
    if (!checkProject) {
      throw new NotFoundException();
    }
    const responseEntity = await this.getOneById(id);
    if (!responseEntity) {
      throw new NotFoundException();
    }
    return responseEntity;
  }

  async check(id: number, idProject: number) {
    const check = await this.getOneByIdOrFail(id, idProject);
    if (!check) {
      return null;
    }
    return check;
  }

  async validation(id: number, idProject: number) {
    const check = await this.check(id, idProject);
    if (!check) {
      throw new NotFoundException('Not Found');
    }
    const project = await this.serviceProject.checkProjectByID(idProject);
    if (!project) {
      return project;
    }
    return true;
  }

  async add(dto, idProject: number) {
    const checkProject = this.serviceProject.checkProjectByID(idProject);
    if (!checkProject) {
      throw new NotFoundException();
    }
    try {
      dto.projectID = idProject;
      const responseEntity = this.repo.create(dto);
      return await this.repo.save(responseEntity);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async edit(id: number, idProject: number, dto) {
    const validation = await this.validation(id, idProject);
    if (!validation) {
      return validation;
    }
    const entityExistProject = await this.repo.count({
      where: { id, projectID: idProject },
    });
    if (!entityExistProject) {
      throw new BadRequestException(' Not Exist In Project');
    }
    try {
      const old = await this.getOneByIdOrFail(id, idProject);
      const editEntity = this.repo.merge(old, dto);
      return this.repo.save(editEntity);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async remove(id: number, idProject: number) {
    const validation = await this.validation(id, idProject);
    if (validation == true) {
      try {
        await this.repo.delete(id);
        return id;
      } catch (e) {
        throw new InternalServerErrorException();
      }
    }
    return validation;
  }
}
