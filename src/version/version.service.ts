import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { VersionRepository } from './version.repository';
import { AddVersionDTO } from './dto/add-version.dto';
import { EditVersionDTO } from './dto/edit-version.dto';
import { VersionEntity } from './version.entity';
import { GetVersionRO } from './ro/get-version.ro';
import { HandleVersionRO } from './ro/handle-version.ro';

@Injectable()
export class VersionService {
  private readonly logger = new Logger(VersionService.name);
  constructor(private readonly repo: VersionRepository) {}

  async getAllVersionByIdProject(projectId: number): Promise<GetVersionRO[]> {
    const oldArray = await this.repo.getAll(projectId);
    const newArray: GetVersionRO[] = [];
    for (let i = 0; i < oldArray.length; i++) {
      const versionRO = await this.getVersionResponse(oldArray[i]);
      newArray.push(versionRO);
    }
    return newArray;
  }

  async getOneById(projectId: number, id: number): Promise<VersionEntity> {
    return await this.repo.getById(id, projectId);
  }

  async getOneByCode(projectId: number, code: string): Promise<VersionEntity> {
    return await this.repo.getByCode(code, projectId);
  }

  async getOneByIdOrFail(projectId: number, id: number): Promise<VersionEntity> {
    const version = await this.getOneById(id, projectId);
    if (!version) {
      throw new NotFoundException('Version not found');
    }
    return version;
  }

  async getOneByCodeOrFail(projectId: number, code: string): Promise<VersionEntity> {
    const version = await this.getOneByCode(projectId, code);
    if (!version) {
      throw new NotFoundException('Version not found');
    }
    return version;
  }

  async getVersionResponse(version: VersionEntity): Promise<GetVersionRO> {
    const response = new GetVersionRO();
    response.name = version.name;
    response.code = version.code;
    response.description = version.description;
    return response;
  }

  async handleVersionResponse(version: VersionEntity): Promise<HandleVersionRO> {
    const response = new HandleVersionRO();
    response.name = version.name;
    response.code = version.code;
    response.description = version.description;
    return response;
  }

  async checkExistCode(projectId: number, code: string, id: number = null) {
    const count = await this.repo.countVersion(projectId, code, id);
    if (count > 0) {
      throw new BadRequestException('Code Exist');
    }
  }

  async add(projectId: number, dto: AddVersionDTO): Promise<HandleVersionRO> {
    await this.checkExistCode(projectId, dto.code);
    try {
      const newVersion = this.repo.create(dto);
      newVersion.projectId = projectId;
      await this.repo.save(newVersion);
      return this.handleVersionResponse(newVersion);
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  async edit(projectId: number, id: number, dto: EditVersionDTO): Promise<HandleVersionRO> {
    const old = await this.getOneByIdOrFail(id, projectId);
    await this.checkExistCode(projectId, dto.code, id);
    try {
      const version = await this.repo.merge(old, dto);
      await this.repo.update(id, version);
      return this.handleVersionResponse(version);
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  async delete(projectId: number, id: number): Promise<number> {
    const version = await this.getOneByIdOrFail(id, projectId);
    try {
      version.isDeleted = version.id;
      await this.repo.update(id, version);
      return id;
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException('Internal Server Error');
    }
  }
}
