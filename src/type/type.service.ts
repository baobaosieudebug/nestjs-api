import {
  BadRequestException,
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

  async getAllTypeByIdProject(idProject: number) {
    return await this.typeRepo.getAll(idProject);
  }

  async getOneById(id: number, idProject: number) {
    return await this.typeRepo.getById(id, idProject);
  }

  async getOneByCode(code: string, idProject: number) {
    return await this.typeRepo.getByCode(code, idProject);
  }

  async getOneByIdOrFail(id: number, idProject: number) {
    const type = await this.getOneById(id, idProject);
    if (!type) {
      throw new NotFoundException('Type not found');
    }
    return type;
  }

  async getOneByCodeOrFail(code: string, idProject: number) {
    const type = await this.getOneByCode(code, idProject);
    if (!type) {
      throw new NotFoundException('Type not found');
    }
    return type;
  }

  async checkExist(code: string, idProject: number) {
    const type = await this.typeRepo.getByCode(code, idProject);
    if (!type) {
      throw new NotFoundException('Type Not Found');
    }
    return type;
  }

  async add(dto: AddTypeDTO, idProject: number) {
    const checkExist = await this.typeRepo.countTypeInProjectByCode(
      dto.code,
      idProject,
    );
    if (checkExist) {
      throw new BadRequestException('Code must be unique');
    }
    try {
      const newType = this.typeRepo.create(dto);
      newType.projectId = idProject;
      return await this.typeRepo.save(newType);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async edit(id: number, idProject: number, dto: EditTypeDTO) {
    const checkExist = await this.typeRepo.countTypeInProjectById(
      id,
      idProject,
    );
    if (!checkExist) {
      throw new NotFoundException('Type not found');
    }
    try {
      return await this.typeRepo.update(id, dto);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async remove(id: number, idProject: number) {
    const checkExist = await this.typeRepo.countTypeInProjectById(
      id,
      idProject,
    );
    if (!checkExist) {
      throw new NotFoundException('Type not found');
    }
    try {
      await this.typeRepo.update(id, { isDeleted: id });
      return id;
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
}
