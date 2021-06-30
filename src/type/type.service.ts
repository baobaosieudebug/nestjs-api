import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { TypeRepository } from './type.repository';
import { AddTypeDTO } from './dto/add-type.dto';
import { EditTypeDTO } from './dto/edit-type.dto';
import { TypeEntity } from './type.entity';
import { AddTypeRO } from './ro/add-type.ro';

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

  async getTypeResponse(type: TypeEntity): Promise<AddTypeRO> {
    const response = new AddTypeRO();
    response.name = type.name;
    response.code = type.code;
    response.description = type.description;
    return response;
  }

  async checkExistCode(id: number, code: string, projectId: number) {
    const checkExist = await this.typeRepo.isTypeExistCode(id, code, projectId);
    if (checkExist) {
      throw new BadRequestException('Code Exist');
    }
  }

  async add(dto: AddTypeDTO, projectId: number): Promise<AddTypeRO> {
    await this.checkExistCode(0, dto.code, projectId);
    try {
      const newType = this.typeRepo.create(dto);
      newType.projectId = projectId;
      await this.typeRepo.save(newType);
      return this.getTypeResponse(newType);
    } catch (e) {
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  async edit(id: number, projectId: number, dto: EditTypeDTO) {
    await this.getOneByIdOrFail(id, projectId);
    await this.checkExistCode(id, dto.code, projectId);
    try {
      await this.typeRepo.update(id, dto);
      return id;
    } catch (e) {
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  async remove(id: number, projectId: number) {
    await this.getOneByIdOrFail(id, projectId);
    try {
      await this.typeRepo.update(id, { isDeleted: id });
      return id;
    } catch (e) {
      throw new InternalServerErrorException('Internal Server Error');
    }
  }
}
