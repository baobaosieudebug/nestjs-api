import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { VersionRepository } from './version.repository';
import { AddVersionDTO } from './dto/add-version.dto';
import { EditVersionDTO } from './dto/edit-version.dto';

@Injectable()
export class VersionService {
  constructor(private readonly versionRepo: VersionRepository) {}

  async getAllVersionByIdProject(idProject: number) {
    return await this.versionRepo.getAll(idProject);
  }

  async getOneById(id: number, idProject: number) {
    return await this.versionRepo.getById(id, idProject);
  }

  async getOneByCode(code: string, idProject: number) {
    return await this.versionRepo.getByCode(code, idProject);
  }

  async getOneByIdOrFail(id: number, idProject: number) {
    const version = await this.getOneById(id, idProject);
    if (!version) {
      throw new NotFoundException('Version not found');
    }
    return version;
  }

  async getOneByCodeOrFail(code: string, idProject: number) {
    const version = await this.getOneByCode(code, idProject);
    if (!version) {
      throw new NotFoundException('Version not found');
    }
    return version;
  }

  async checkExist(code: string, idProject: number) {
    const version = await this.versionRepo.getByCode(code, idProject);
    if (!version) {
      throw new NotFoundException('Version Not Found');
    }
    return version;
  }

  async add(dto: AddVersionDTO, idProject: number) {
    const checkExist = await this.versionRepo.countVersionInProjectByCode(
      dto.code,
      idProject,
    );
    if (checkExist) {
      throw new BadRequestException('Code must be unique');
    }
    try {
      const newVersion = this.versionRepo.create(dto);
      newVersion.projectId = idProject;
      return await this.versionRepo.save(newVersion);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async edit(id: number, idProject: number, dto: EditVersionDTO) {
    const checkExist = await this.versionRepo.countVersionInProjectById(
      id,
      idProject,
    );
    if (!checkExist) {
      throw new NotFoundException('Version not found');
    }
    try {
      return await this.versionRepo.update(id, dto);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async remove(id: number, idProject: number) {
    const checkExist = await this.versionRepo.countVersionInProjectById(
      id,
      idProject,
    );
    if (!checkExist) {
      throw new NotFoundException('Version not found');
    }
    try {
      await this.versionRepo.update(id, { isDeleted: id });
      return id;
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
}
