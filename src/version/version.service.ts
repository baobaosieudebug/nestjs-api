import {
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

  async checkExistCode(code: string, projectId: number) {
    const checkExist = await this.versionRepo.isVersionExistCode(
      code,
      projectId,
    );
    if (checkExist) {
      throw new NotFoundException('Version Exist');
    }
    return checkExist;
  }

  async add(dto: AddVersionDTO, projectId: number) {
    const checkExist = await this.checkExistCode(dto.code, projectId);
    if (!checkExist) {
      try {
        const newVersion = this.versionRepo.create(dto);
        newVersion.projectId = projectId;
        return await this.versionRepo.save(newVersion);
      } catch (e) {
        throw new InternalServerErrorException();
      }
    }
  }

  async edit(id: number, projectId: number, dto: EditVersionDTO) {
    const version = await this.getOneByIdOrFail(id, projectId);
    const checkExist = await this.checkExistCode(dto.code, projectId);
    if (!checkExist) {
      try {
        return await this.versionRepo.update(version.id, dto);
      } catch (e) {
        throw new InternalServerErrorException();
      }
    }
  }

  async remove(id: number, projectId: number) {
    const checkExist = await this.getOneByIdOrFail(id, projectId);
    if (checkExist) {
      try {
        await this.versionRepo.update(id, { isDeleted: id });
        return id;
      } catch (e) {
        throw new InternalServerErrorException();
      }
    }
  }
}
