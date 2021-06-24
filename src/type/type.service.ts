import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { TypeRepository } from './type.repository';
import { AddTypeDTO } from './dto/add-type.dto';
import { EditTypeDTO } from './dto/edit-type.dto';
import { ProjectService } from '../project/project.service';

@Injectable()
export class TypeService {
  constructor(
    private readonly typeRepo: TypeRepository,
    private readonly projectService: ProjectService,
  ) {}

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

  async checkType(id: number) {
    const type = await this.typeRepo.getOneByIdOrFail(id);
    if (!type) {
      return null;
    }
    return type;
  }

  async validation(id: number, idProject: number) {
    const checkType = await this.checkType(id);
    if (!checkType) {
      throw new NotFoundException();
    }
    const project = await this.projectService.getOneById(idProject);
    if (!project) {
      throw new NotFoundException('Project not Exist');
    }
    return true;
  }

  async add(dto: AddTypeDTO) {
    try {
      const type = this.typeRepo.create(dto);
      return await this.typeRepo.save(type);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
  async edit(id: number, idProject: number, dto: EditTypeDTO) {
    const validation = this.validation(id, idProject);
    if (!validation) {
      return validation;
    }
    const statusExistProject = await this.typeRepo.countTypeInProject(
      id,
      idProject,
    );
    if (!statusExistProject) {
      throw new BadRequestException('Status not Exist In Project');
    }
    try {
      return await this.typeRepo.update(id, dto);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async remove(id: number, idProject: number) {
    const validation = this.validation(id, idProject);
    if (!validation) {
      return validation;
    }
    try {
      await this.typeRepo.delete(id);
      return id;
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async addTypeInProject(id: number, idProject: number) {
    const validation = await this.validation(id, idProject);
    if (!validation) {
      return validation;
    }
    const typeExistProject = await this.typeRepo.countTypeInProject(
      id,
      idProject,
    );
    if (typeExistProject) {
      throw new BadRequestException('Type Exist In Project');
    }
    try {
      return await this.typeRepo.update(id, { projectID: idProject });
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
}
