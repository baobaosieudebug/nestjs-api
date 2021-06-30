import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CategoryRepository } from './category.repository';
import { AddCategoryDTO } from './dto/add-category.dto';
import { EditCategoryDTO } from './dto/edit-category.dto';
import { AddCategoryRO } from './ro/add-category.ro';
import { CategoryEntity } from './category.entity';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepo: CategoryRepository) {}

  async getAllCategoryByIdProject(projectId: number) {
    return await this.categoryRepo.getAll(projectId);
  }

  async getOneById(id: number, projectId: number) {
    return await this.categoryRepo.getById(id, projectId);
  }

  async getOneByCode(code: string, projectId: number) {
    return await this.categoryRepo.getByCode(code, projectId);
  }

  async getOneByIdOrFail(id: number, projectId: number) {
    const category = await this.getOneById(id, projectId);
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  async getOneByCodeOrFail(code: string, projectId: number) {
    const category = await this.getOneByCode(code, projectId);
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  async getCategoryResponse(category: CategoryEntity): Promise<AddCategoryRO> {
    const response = new AddCategoryRO();
    response.name = category.name;
    response.code = category.code;
    response.description = category.description;
    return response;
  }

  async checkExistCode(id: number, code: string, projectId: number) {
    const checkExist = await this.categoryRepo.isCategoryExistCode(
      id,
      code,
      projectId,
    );
    if (checkExist) {
      throw new BadRequestException('Code Exist');
    }
  }

  async add(dto: AddCategoryDTO, projectId: number): Promise<AddCategoryRO> {
    await this.checkExistCode(0, dto.code, projectId);
    try {
      const newCategory = this.categoryRepo.create(dto);
      newCategory.projectId = projectId;
      await this.categoryRepo.save(newCategory);
      return this.getCategoryResponse(newCategory);
    } catch (e) {
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  async edit(id: number, projectId: number, dto: EditCategoryDTO) {
    await this.getOneByIdOrFail(id, projectId);
    await this.checkExistCode(id, dto.code, projectId);
    try {
      await this.categoryRepo.update(id, dto);
      return id;
    } catch (e) {
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  async remove(id: number, projectId: number) {
    await this.getOneByIdOrFail(id, projectId);
    try {
      await this.categoryRepo.update(id, { isDeleted: id });
      return id;
    } catch (e) {
      throw new InternalServerErrorException('Internal Server Error');
    }
  }
}
