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

  async add(dto: AddVersionDTO) {
    try {
      const version = this.versionRepo.create(dto);
      return await this.versionRepo.save(version);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
  async edit(id: number, dto: EditVersionDTO) {
    try {
      return await this.versionRepo.update(id, dto);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async remove(id: number) {
    try {
      await this.versionRepo.delete(id);
      return id;
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
}
