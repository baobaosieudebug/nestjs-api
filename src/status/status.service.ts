import {
  BadRequestException,
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

  async getAllStatusByIdProject(idProject: number) {
    return await this.statusRepo.getAll(idProject);
  }

  async getOneById(id: number, idProject: number) {
    return await this.statusRepo.getById(id, idProject);
  }

  async getOneByCode(code: string, idProject: number) {
    return await this.statusRepo.getByCode(code, idProject);
  }

  async getOneByIdOrFail(id: number, idProject: number) {
    const status = await this.getOneById(id, idProject);
    if (!status) {
      throw new NotFoundException('Status not found');
    }
    return status;
  }

  async getOneByCodeOrFail(code: string, idProject: number) {
    const status = await this.getOneByCode(code, idProject);
    if (!status) {
      throw new NotFoundException('Status not found');
    }
    return status;
  }

  async checkExist(code: string, idProject: number) {
    const status = await this.statusRepo.getByCode(code, idProject);
    if (!status) {
      throw new NotFoundException('Status Not Found');
    }
    return status;
  }

  async add(dto: AddStatusDTO, idProject: number) {
    const checkExist = await this.statusRepo.countStatusInProjectByCode(
      dto.code,
      idProject,
    );
    if (checkExist) {
      throw new BadRequestException('Code must be unique');
    }
    try {
      const newStatus = this.statusRepo.create(dto);
      newStatus.projectId = idProject;
      return await this.statusRepo.save(newStatus);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async edit(id: number, idProject: number, dto: EditStatusDTO) {
    const checkExist = await this.statusRepo.countStatusInProjectById(
      id,
      idProject,
    );
    if (!checkExist) {
      throw new NotFoundException('Status not found');
    }
    try {
      return await this.statusRepo.update(id, dto);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async remove(id: number, idProject: number) {
    const checkExist = await this.statusRepo.countStatusInProjectById(
      id,
      idProject,
    );
    if (!checkExist) {
      throw new NotFoundException('Status not found');
    }
    try {
      await this.statusRepo.update(id, { isDeleted: id });
      return id;
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
}
