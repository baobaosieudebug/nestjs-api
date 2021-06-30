import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { StatusRepository } from './status.repository';
import { AddStatusDTO } from './dto/add-status.dto';
import { EditStatusDTO } from './dto/edit-status.dto';

@Injectable()
export class StatusService {
  constructor(private readonly statusRepo: StatusRepository) {}

  async getAllStatusByIdProject(projectId: number) {
    return await this.statusRepo.getAll(projectId);
  }

  async getOneById(id: number, projectId: number) {
    return await this.statusRepo.getById(id, projectId);
  }

  async getOneByCode(code: string, projectId: number) {
    return await this.statusRepo.getByCode(code, projectId);
  }

  async getOneByIdOrFail(id: number, projectId: number) {
    const status = await this.getOneById(id, projectId);
    if (!status) {
      throw new NotFoundException('Status not found');
    }
    return status;
  }

  async getOneByCodeOrFail(code: string, projectId: number) {
    const status = await this.getOneByCode(code, projectId);
    if (!status) {
      throw new NotFoundException('Status not found');
    }
    return status;
  }

  async checkExistCode(code: string, projectId: number) {
    const checkExist = await this.statusRepo.isStatusExistCode(code, projectId);
    if (checkExist) {
      throw new NotFoundException('Status Exist');
    }
    return checkExist;
  }

  async add(dto: AddStatusDTO, projectId: number) {
    const checkExist = await this.checkExistCode(dto.code, projectId);
    if (!checkExist) {
      try {
        const newStatus = this.statusRepo.create(dto);
        newStatus.projectId = projectId;
        return await this.statusRepo.save(newStatus);
      } catch (e) {
        throw new InternalServerErrorException();
      }
    }
  }

  async edit(id: number, projectId: number, dto: EditStatusDTO) {
    const status = await this.getOneByIdOrFail(id, projectId);
    const checkExist = await this.checkExistCode(dto.code, projectId);
    if (!checkExist) {
      try {
        return await this.statusRepo.update(status.id, dto);
      } catch (e) {
        throw new InternalServerErrorException();
      }
    }
  }

  async remove(id: number, projectId: number) {
    const checkExist = await this.getOneByIdOrFail(id, projectId);
    if (checkExist) {
      try {
        await this.statusRepo.update(id, { isDeleted: id });
        return id;
      } catch (e) {
        throw new InternalServerErrorException();
      }
    }
  }
}
