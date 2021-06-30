import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { StatusRepository } from './status.repository';
import { AddStatusDTO } from './dto/add-status.dto';
import { EditStatusDTO } from './dto/edit-status.dto';
import { StatusEntity } from './status.entity';
import { AddStatusRO } from './ro/add-status.ro';

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

  async getStatusResponse(status: StatusEntity): Promise<AddStatusRO> {
    const response = new AddStatusRO();
    response.name = status.name;
    response.code = status.code;
    response.description = status.description;
    return response;
  }

  async checkExistCode(id: number, code: string, projectId: number) {
    const checkExist = await this.statusRepo.isStatusExistCode(
      id,
      code,
      projectId,
    );
    if (checkExist) {
      throw new BadRequestException('Code Exist');
    }
  }

  async add(dto: AddStatusDTO, projectId: number): Promise<AddStatusRO> {
    await this.checkExistCode(0, dto.code, projectId);
    try {
      const newStatus = this.statusRepo.create(dto);
      newStatus.projectId = projectId;
      await this.statusRepo.save(newStatus);
      return this.getStatusResponse(newStatus);
    } catch (e) {
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  async edit(id: number, projectId: number, dto: EditStatusDTO) {
    await this.getOneByIdOrFail(id, projectId);
    await this.checkExistCode(id, dto.code, projectId);
    try {
      await this.statusRepo.update(id, dto);
      return id;
    } catch (e) {
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  async remove(id: number, projectId: number) {
    await this.getOneByIdOrFail(id, projectId);
    try {
      await this.statusRepo.update(id, { isDeleted: id });
      return id;
    } catch (e) {
      throw new InternalServerErrorException('Internal Server Error');
    }
  }
}
