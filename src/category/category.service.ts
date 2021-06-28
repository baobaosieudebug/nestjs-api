import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CategoryRepository } from './category.repository';
import { AddCategoryDTO } from './dto/add-category.dto';
import { EditCategoryDTO } from './dto/edit-category.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepo: CategoryRepository) {}

  async getAllCategoryByIdProject(idProject: number) {
    return await this.categoryRepo.getAll(idProject);
  }

  async getOneById(id: number, idProject: number) {
    return await this.categoryRepo.getById(id, idProject);
  }

  async getOneByCode(code: string) {
    return await this.categoryRepo.getByCode(code);
  }

  async getOneByIdOrFail(id: number, idProject: number) {
    const category = await this.getOneById(id, idProject);
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  async getOneByCodeOrFail(code: string) {
    const category = await this.getOneByCode(code);
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  async checkExist(code: string) {
    const category = await this.categoryRepo.getByCode(code);
    if (!category) {
      throw new NotFoundException('Category Not Found');
    }
    return category;
  }

  async add(dto: AddCategoryDTO, idProject: number) {
    const checkExist = await this.categoryRepo.countCategoryInProjectByCode(
      dto.code,
      idProject,
    );
    if (checkExist) {
      throw new BadRequestException('Code must be unique');
    }
    try {
      const newCategory = this.categoryRepo.create(dto);
      newCategory.projectId = idProject;
      return await this.categoryRepo.save(newCategory);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async edit(id: number, idProject: number, dto: EditCategoryDTO) {
    const checkExist = await this.categoryRepo.countCategoryInProjectById(
      id,
      idProject,
    );
    if (!checkExist) {
      throw new NotFoundException('Category not found');
    }
    try {
      return await this.categoryRepo.update(id, dto);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async remove(id: number, idProject: number) {
    const checkExist = await this.categoryRepo.countCategoryInProjectById(
      id,
      idProject,
    );
    if (!checkExist) {
      throw new NotFoundException('Category not found');
    }
    try {
      await this.categoryRepo.update(id, { isDeleted: id });
      return id;
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
}
