import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { VersionRepository } from './version.repository';
import { AddVersionDTO } from './dto/add-version.dto';
import { EditVersionDTO } from './dto/edit-version.dto';
import { ProjectService } from '../project/project.service';

@Injectable()
export class VersionService {
  constructor(
    private readonly versionRepo: VersionRepository,
    private readonly projectService: ProjectService,
  ) {}

  getAll() {
    return this.versionRepo.getAll();
  }

  getOneById(id: number) {
    return this.versionRepo.getById(id);
  }

  async getOneByIdOrFail(id: number) {
    const response = await this.getOneById(id);
    if (!response) {
      throw new NotFoundException();
    }
    return response;
  }

  async checkVersion(id: number) {
    const version = await this.versionRepo.getOneByIdOrFail(id);
    if (!version) {
      return null;
    }
    return version;
  }

  async validation(id: number, idProject: number) {
    const checkVersion = await this.checkVersion(id);
    if (!checkVersion) {
      throw new NotFoundException();
    }
    const project = await this.projectService.getOneById(idProject);
    if (!project) {
      throw new NotFoundException('Project not Exist');
    }
    return true;
  }

  async add(dto: AddVersionDTO) {
    try {
      const version = this.versionRepo.create(dto);
      return await this.versionRepo.save(version);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
  async edit(id: number, idProject: number, dto: EditVersionDTO) {
    const validation = await this.validation(id, idProject);
    if (!validation) {
      return validation;
    }
    const versionExistProject = await this.versionRepo.countVersionInProject(
      id,
      idProject,
    );
    if (!versionExistProject) {
      throw new BadRequestException('Version not Exist In Project');
    }
    try {
      return await this.versionRepo.update(id, dto);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async remove(id: number, idProject: number) {
    const validation = this.validation(id, idProject);
    if (!validation) {
      return validation;
    }
    try {
      await this.versionRepo.delete(id);
      return id;
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async addVersionInProject(id: number, idProject: number) {
    const validation = this.validation(id, idProject);
    if (!validation) {
      return validation;
    }
    const versionExistProject = await this.versionRepo.countVersionInProject(
      id,
      idProject,
    );
    if (versionExistProject) {
      throw new BadRequestException('Version Exist In Project');
    }
    try {
      return await this.versionRepo.update(id, { projectID: idProject });
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
}
