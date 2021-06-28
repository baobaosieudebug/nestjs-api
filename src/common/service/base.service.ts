import {
  BadRequestException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { ProjectService } from '../../project/project.service';

export class BaseService<T> {
  constructor(private repo: Repository<T>) {}

  getAll(idProject: number) {
    return this.repo.find({ where: { projectID: idProject } });
  }

  getOneById(id: number): Promise<T> {
    return this.repo.findOne(id);
  }

  // async getOneByIdOrFail(id: number, idProject: number): Promise<T> {
  //   const checkProject = this.projectService.checkProjectByID(idProject);
  //   if (!checkProject) {
  //     throw new NotFoundException();
  //   }
  //   const responseEntity = await this.getOneById(id);
  //   if (!responseEntity) {
  //     throw new NotFoundException();
  //   }
  //   return responseEntity;
  // }

  // async check(id: number, idProject: number) {
  //   const check = await this.getOneByIdOrFail(id, idProject);
  //   if (!check) {
  //     return null;
  //   }
  //   return check;
  // }
  //
  // async add(dto, idProject: number) {
  //   const checkProject = this.projectService.checkProjectByID(idProject);
  //   if (!checkProject) {
  //     throw new NotFoundException();
  //   }
  //   try {
  //     dto.projectID = idProject;
  //     const responseEntity = this.repo.create(dto);
  //     return await this.repo.save(responseEntity);
  //   } catch (e) {
  //     throw new InternalServerErrorException();
  //   }
  // }

  // async edit(id: number, idProject: number, dto) {
  //   const entityExistProject = await this.repo.count({
  //     where: { id, projectID: idProject },
  //   });
  //   if (!entityExistProject) {
  //     throw new BadRequestException(' Not Exist In Project');
  //   }
  //   try {
  //     // const old = await this.getOneByIdOrFail(id, idProject);
  //     const editEntity = this.repo.merge(old, dto);
  //     return this.repo.save(editEntity);
  //   } catch (e) {
  //     throw new InternalServerErrorException();
  //   }
  // }

  // async remove(id: number, idProject: number) {
  //   try {
  //     await this.repo.delete(id);
  //     return id;
  //   } catch (e) {
  //     throw new InternalServerErrorException();
  //   }
  // }
}
