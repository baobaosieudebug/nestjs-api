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

  async getAllTypeByIdProject(projectId: number) {
    return await this.typeRepo.getAll(projectId);
  }

  async getOneById(id: number, projectId: number) {
    return await this.typeRepo.getById(id, projectId);
  }

  async getOneByCode(code: string, projectId: number) {
    return await this.typeRepo.getByCode(code, projectId);
  }

  async getOneByIdOrFail(id: number, projectId: number) {
    const type = await this.getOneById(id, projectId);
    if (!type) {
      throw new NotFoundException('Type not found');
    }
    return type;
  }

  async getOneByCodeOrFail(code: string, projectId: number) {
    const type = await this.getOneByCode(code, projectId);
    if (!type) {
      throw new NotFoundException('Type not found');
    }
    return type;
  }

  async checkExistCode(code: string, projectId: number) {
    const checkExist = await this.typeRepo.isTypeExistCode(code, projectId);
    if (checkExist) {
      throw new NotFoundException('Type Exist');
    }
    return checkExist;
  }

  async add(dto: AddTypeDTO, projectId: number) {
    const checkExist = await this.checkExistCode(dto.code, projectId);
    if (!checkExist) {
      try {
        const newType = this.typeRepo.create(dto);
        newType.projectId = projectId;
        return await this.typeRepo.save(newType);
      } catch (e) {
        throw new InternalServerErrorException();
      }
    }
  }

  async edit(id: number, projectId: number, dto: EditTypeDTO) {
    const checkExist = await this.checkExistCode(dto.code, projectId);
    if (!checkExist) {
      try {
        return await this.typeRepo.update(id, dto);
      } catch (e) {
        throw new InternalServerErrorException();
      }
    }
  }

  async remove(id: number, projectId: number) {
    const checkExist = await this.getOneByIdOrFail(id, projectId);
    if (checkExist) {
      try {
        await this.typeRepo.update(id, { isDeleted: id });
        return id;
      } catch (e) {
        throw new InternalServerErrorException();
      }
    }
  }
}
