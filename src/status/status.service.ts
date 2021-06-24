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

  getAll() {
    return this.statusRepo.getAll();
  }

  getOneById(id: number) {
    return this.statusRepo.getById(id);
  }

  async getOneByIdOrFail(id: number) {
    const response = await this.getOneById(id);
    if (!response) {
      throw new NotFoundException();
    }
    return response;
  }

  async add(dto: AddStatusDTO) {
    try {
      const status = this.statusRepo.create(dto);
      return await this.statusRepo.save(status);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
  async edit(id: number, dto: EditStatusDTO) {
    try {
      return await this.statusRepo.update(id, dto);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async remove(id: number) {
    try {
      await this.statusRepo.delete(id);
      return id;
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
}
