import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CategoryRepository } from './category.repository';
import { AddCategoryDTO } from './dto/add-category.dto';
import { EditCategoryDTO } from './dto/edit-category.dto';
import { ProjectService } from '../project/project.service';

@Injectable()
export class CategoryService {
  constructor(
    private readonly categoryRepo: CategoryRepository,
    private readonly projectService: ProjectService,
  ) {}

  getAll(id) {
    return this.categoryRepo.getAll(id);
  }

  getOneById(id: number) {
    return this.categoryRepo.getById(id);
  }

  async getOneByIdOrFail(id: number) {
    const response = await this.getOneById(id);
    if (!response) {
      throw new NotFoundException();
    }
    return response;
  }

  async validation(id: number, idProject: number) {
    const checkCategory = await this.checkCategory(id);
    if (!checkCategory) {
      throw new NotFoundException();
    }
    const project = await this.projectService.getOneById(idProject);
    if (!project) {
      throw new NotFoundException('Project not Exist');
    }
    return true;
  }

  async add(dto: AddCategoryDTO) {
    try {
      const category = this.categoryRepo.create(dto);
      return await this.categoryRepo.save(category);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
  async edit(id: number, idProject: number, dto: EditCategoryDTO) {
    const validation = await this.validation(id, idProject);
    if (!validation) {
      return validation;
    }
    const categoryExistProject = await this.categoryRepo.countCategoryInProject(
      id,
      idProject,
    );
    if (!categoryExistProject) {
      throw new BadRequestException('Category not Exist In Project');
    }
    try {
      return await this.categoryRepo.update(id, dto);
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
      await this.categoryRepo.delete(id);
      return id;
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async checkCategory(id: number) {
    const category = await this.categoryRepo.getOneByIdOrFail(id);
    if (!category) {
      return null;
    }
    return category;
  }

  async addCategoryInProject(id: number, idProject: number) {
    const validation = this.validation(id, idProject);
    if (!validation) {
      return validation;
    }
    const categoryExistProject = await this.categoryRepo.countCategoryInProject(
      id,
      idProject,
    );
    if (categoryExistProject) {
      throw new BadRequestException('Category Exist In Project');
    }
    try {
      return await this.categoryRepo.update(id, { projectID: idProject });
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
}
