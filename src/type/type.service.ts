import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { TypeRepository } from './type.repository';
import { AddTypeDTO } from './dto/add-type.dto';
import { EditTypeDTO } from './dto/edit-type.dto';
import { TypeEntity } from './type.entity';
import { GetTypeRO } from './ro/get-type.ro';
import { HandleTypeRO } from './ro/handle-type.ro';

@Injectable()
export class TypeService {
  private readonly logger = new Logger(TypeService.name);
  constructor(private readonly repo: TypeRepository) {}

  async getAllTypeByIdProject(projectId: number): Promise<GetTypeRO[]> {
    const oldArray = await this.repo.getAll(projectId);
    const newArray: GetTypeRO[] = [];
    for (let i = 0; i < oldArray.length; i++) {
      const typeRO = await this.getTypeResponse(oldArray[i]);
      newArray.push(typeRO);
    }
    return newArray;
  }

  async getOneById(id: number, projectId: number): Promise<TypeEntity> {
    return await this.repo.getById(id, projectId);
  }

  async getOneByCode(code: string, projectId: number): Promise<TypeEntity> {
    return await this.repo.getByCode(code, projectId);
  }

  async getOneByIdOrFail(id: number, projectId: number): Promise<TypeEntity> {
    const type = await this.getOneById(id, projectId);
    if (!type) {
      throw new NotFoundException('Type not found');
    }
    return type;
  }

  async getOneByCodeOrFail(code: string, projectId: number): Promise<TypeEntity> {
    const type = await this.getOneByCode(code, projectId);
    if (!type) {
      throw new NotFoundException('Type not found');
    }
    return type;
  }

  async getTypeResponse(type: TypeEntity): Promise<GetTypeRO> {
    const response = new GetTypeRO();
    response.name = type.name;
    response.code = type.code;
    response.description = type.description;
    return response;
  }

  async handleTypeResponse(type: TypeEntity): Promise<HandleTypeRO> {
    const response = new HandleTypeRO();
    response.name = type.name;
    response.code = type.code;
    response.description = type.description;
    return response;
  }

  async checkExistCode(projectId: number, code: string, id: number = null) {
    const count = await this.repo.countType(projectId, code, id);
    if (count > 0) {
      throw new BadRequestException('Code Exist');
    }
  }

  async add(dto: AddTypeDTO, projectId: number): Promise<HandleTypeRO> {
    await this.checkExistCode(projectId, dto.code);
    try {
      const newType = this.repo.create(dto);
      newType.projectId = projectId;
      await this.repo.save(newType);
      return this.handleTypeResponse(newType);
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  async edit(id: number, projectId: number, dto: EditTypeDTO): Promise<HandleTypeRO> {
    const old = await this.getOneByIdOrFail(id, projectId);
    await this.checkExistCode(projectId, dto.code, id);
    try {
      const type = await this.repo.merge(old, dto);
      await this.repo.update(id, type);
      return this.handleTypeResponse(type);
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  async delete(id: number, projectId: number): Promise<HandleTypeRO> {
    const type = await this.getOneByIdOrFail(id, projectId);
    try {
      type.isDeleted = type.id;
      await this.repo.update(id, type);
      return this.handleTypeResponse(type);
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException('Internal Server Error');
    }
  }
}
