import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { StatusRepository } from './status.repository';
import { AddStatusDTO } from './dto/add-status.dto';
import { EditStatusDTO } from './dto/edit-status.dto';
import { ProjectService } from '../project/project.service';

@Injectable()
export class StatusService {
  constructor(
    private readonly statusRepo: StatusRepository,
    private readonly projectService: ProjectService,
  ) {}

  getAll() {
    return this.statusRepo.getAll();
  }

  getOneById(id: number) {
    return this.statusRepo.getById(id);
  }

  async getOneByIdOrFail(id: number) {
    const response = await this.getOneById(id);
    if (!response) {
      throw new NotFoundException();
    }
    return response;
  }

  async checkStatus(id: number) {
    const status = await this.statusRepo.getOneByIdOrFail(id);
    if (!status) {
      return null;
    }
    return status;
  }

  async validation(id: number, idProject: number) {
    const checkStatus = await this.checkStatus(id);
    if (!checkStatus) {
      throw new NotFoundException();
    }
    const project = await this.projectService.getOneById(idProject);
    if (!project) {
      throw new NotFoundException('Project not Exist');
    }
    return true;
  }

  async add(dto: AddStatusDTO) {
    try {
      const status = this.statusRepo.create(dto);
      return await this.statusRepo.save(status);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
  async edit(id: number, idProject: number, dto: EditStatusDTO) {
    const validation = await this.validation(id, idProject);
    if (!validation) {
      return validation;
    }
    const statusExistProject = await this.statusRepo.countStatusInProject(
      id,
      idProject,
    );
    if (!statusExistProject) {
      throw new BadRequestException('Status not Exist In Project');
    }
    try {
      return await this.statusRepo.update(id, dto);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async remove(id: number) {
    try {
      await this.statusRepo.delete(id);
      return id;
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async addStatusInProject(id: number, idProject: number) {
    const validation = this.validation(id, idProject);
    if (!validation) {
      return validation;
    }
    const statusExistProject = await this.statusRepo.countStatusInProject(
      id,
      idProject,
    );
    if (statusExistProject) {
      throw new BadRequestException('Status Exist In Project');
    }
    try {
      return await this.statusRepo.update(id, { projectID: idProject });
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
}
