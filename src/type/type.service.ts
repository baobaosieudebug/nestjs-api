import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { TypeRepository } from './type.repository';
import { AddTypeDTO } from './dto/add-type.dto';
import { EditTypeDTO } from './dto/edit-type.dto';

@Injectable()
export class TypeService {
  constructor(private readonly typeRepo: TypeRepository) {}

  getAll() {
    return this.typeRepo.getAll();
  }

  getOneById(id: number) {
    return this.typeRepo.getById(id);
  }

  async getOneByIdOrFail(id: number) {
    const response = await this.getOneById(id);
    if (!response) {
      throw new NotFoundException();
    }
    return response;
  }

  async add(dto: AddTypeDTO) {
    try {
      const type = this.typeRepo.create(dto);
      return await this.typeRepo.save(type);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
  async edit(id: number, dto: EditTypeDTO) {
    try {
      return await this.typeRepo.update(id, dto);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async remove(id: number) {
    try {
      await this.typeRepo.delete(id);
      return id;
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
}
