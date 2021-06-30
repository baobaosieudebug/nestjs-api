import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { VersionRepository } from './version.repository';
import { AddVersionDTO } from './dto/add-version.dto';
import { EditVersionDTO } from './dto/edit-version.dto';
import { VersionEntity } from './version.entity';
import { AddVersionRO } from './ro/add-version.ro';
@Injectable()
export class VersionService {
  constructor(private readonly versionRepo: VersionRepository) {}

  async getAllVersionByIdProject(projectId: number) {
    return await this.versionRepo.getAll(projectId);
  }

  async getOneById(id: number, projectId: number) {
    return await this.versionRepo.getById(id, projectId);
  }

  async getOneByCode(code: string, projectId: number) {
    return await this.versionRepo.getByCode(code, projectId);
  }

  async getOneByIdOrFail(id: number, projectId: number) {
    const version = await this.getOneById(id, projectId);
    if (!version) {
      throw new NotFoundException('Version not found');
    }
    return version;
  }

  async getOneByCodeOrFail(code: string, projectId: number) {
    const version = await this.getOneByCode(code, projectId);
    if (!version) {
      throw new NotFoundException('Version not found');
    }
    return version;
  }

  async getVersionResponse(version: VersionEntity): Promise<AddVersionRO> {
    const response = new AddVersionRO();
    response.name = version.name;
    response.code = version.code;
    response.description = version.description;
    return response;
  }

  async checkExistCode(id: number, code: string, projectId: number) {
    const checkExist = await this.versionRepo.isVersionExistCode(
      id,
      code,
      projectId,
    );
    if (checkExist) {
      throw new BadRequestException('Code Exist');
    }
  }

  async add(dto: AddVersionDTO, projectId: number): Promise<AddVersionRO> {
    await this.checkExistCode(0, dto.code, projectId);
    try {
      const newVersion = this.versionRepo.create(dto);
      newVersion.projectId = projectId;
      await this.versionRepo.save(newVersion);
      return this.getVersionResponse(newVersion);
    } catch (e) {
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  async edit(id: number, projectId: number, dto: EditVersionDTO) {
    await this.getOneByIdOrFail(id, projectId);
    await this.checkExistCode(id, dto.code, projectId);
    try {
      await this.versionRepo.update(id, dto);
      return id;
    } catch (e) {
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  async remove(id: number, projectId: number) {
    await this.getOneByIdOrFail(id, projectId);
    try {
      await this.versionRepo.update(id, { isDeleted: id });
      return id;
    } catch (e) {
      throw new InternalServerErrorException('Internal Server Error');
    }
  }
}
