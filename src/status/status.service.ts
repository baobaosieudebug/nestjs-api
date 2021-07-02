import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { StatusRepository } from './status.repository';
import { AddStatusDTO } from './dto/add-status.dto';
import { EditStatusDTO } from './dto/edit-status.dto';
import { StatusEntity } from './status.entity';
import { GetStatusRO } from './ro/get-status.ro';
import { HandleStatusRO } from './ro/handle-status.ro';

@Injectable()
export class StatusService {
  private readonly logger = new Logger(StatusService.name);
  constructor(private readonly repo: StatusRepository) {}

  async getAllStatusByIdProject(projectId: number): Promise<GetStatusRO[]> {
    const oldArray = await this.repo.getAll(projectId);
    const newArray: GetStatusRO[] = [];
    for (let i = 0; i < oldArray.length; i++) {
      const statusRO = await this.getStatusResponse(oldArray[i]);
      newArray.push(statusRO);
    }
    return newArray;
  }

  async getOneById(projectId: number, id: number): Promise<StatusEntity> {
    return await this.repo.getById(id, projectId);
  }

  async getOneByCode(projectId: number, code: string): Promise<StatusEntity> {
    return await this.repo.getByCode(code, projectId);
  }

  async getOneByIdOrFail(projectId: number, id: number): Promise<StatusEntity> {
    const status = await this.getOneById(id, projectId);
    if (!status) {
      throw new NotFoundException('Status not found');
    }
    return status;
  }

  async getOneByCodeOrFail(projectId: number, code: string): Promise<StatusEntity> {
    const status = await this.getOneByCode(projectId, code);
    if (!status) {
      throw new NotFoundException('Status not found');
    }
    return status;
  }

  async getStatusResponse(status: StatusEntity): Promise<GetStatusRO> {
    const response = new GetStatusRO();
    response.name = status.name;
    response.code = status.code;
    response.description = status.description;
    return response;
  }

  async handleStatusResponse(status: StatusEntity): Promise<HandleStatusRO> {
    const response = new HandleStatusRO();
    response.name = status.name;
    response.code = status.code;
    response.description = status.description;
    return response;
  }

  async checkExistCode(projectId: number, code: string, id: number = null) {
    const count = await this.repo.countStatus(projectId, code, id);
    if (count > 0) {
      throw new BadRequestException('Code Exist');
    }
  }

  async add(projectId: number, dto: AddStatusDTO): Promise<HandleStatusRO> {
    await this.checkExistCode(projectId, dto.code);
    try {
      const newStatus = this.repo.create(dto);
      newStatus.projectId = projectId;
      await this.repo.save(newStatus);
      return this.handleStatusResponse(newStatus);
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  async edit(projectId: number, id: number, dto: EditStatusDTO): Promise<HandleStatusRO> {
    const old = await this.getOneByIdOrFail(id, projectId);
    await this.checkExistCode(projectId, dto.code, id);
    try {
      const status = await this.repo.merge(old, dto);
      await this.repo.update(id, status);
      return this.handleStatusResponse(status);
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  async delete(projectId: number, id: number): Promise<number> {
    const status = await this.getOneByIdOrFail(id, projectId);
    try {
      status.isDeleted = status.id;
      await this.repo.update(id, status);
      return id;
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException('Internal Server Error');
    }
  }
}
