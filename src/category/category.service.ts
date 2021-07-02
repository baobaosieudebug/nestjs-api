import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CategoryRepository } from './category.repository';
import { AddCategoryDTO } from './dto/add-category.dto';
import { EditCategoryDTO } from './dto/edit-category.dto';
import { AddCategoryRO } from './ro/add-category.ro';
import { CategoryEntity } from './category.entity';

@Injectable()
export class CategoryService {
  private readonly logger = new Logger(CategoryService.name);
  constructor(private readonly repo: CategoryRepository) {}

  async getAllCategoryByIdProject(projectId: number) {
    // const list = await this.repo.getAll(projectId);
    // const foo: AddCategoryRO[] = [];
    // for (let i = 0; i < list.length; i++) {
    //   const object = await this.getCategoryResponse(list[i]);
    //   foo.push(object);
    // }
    // return foo;
  }

  async getOneById(id: number, projectId: number) {
    return await this.repo.getById(id, projectId);
  }

  async getOneByCode(code: string, projectId: number) {
    return await this.repo.getByCode(code, projectId);
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

  async checkExistCode(projectId: number, code: string, id: number = null) {
    const count = await this.repo.countCategory(projectId, code, id);
    if (count > 0) {
      throw new BadRequestException('Code Exist');
    }
  }

  async add(dto: AddCategoryDTO, projectId: number) {
    await this.checkExistCode(projectId, dto.code);
    try {
      const newCategory = this.repo.create(dto);
      newCategory.projectId = projectId;
      await this.repo.save(newCategory);
      return this.getCategoryResponse(newCategory);
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  async edit(id: number, projectId: number, dto: EditCategoryDTO) {
    const old = await this.getOneByIdOrFail(id, projectId);
    await this.checkExistCode(projectId, dto.code, id);
    try {
      const category = await this.repo.merge(old, dto);
      await this.repo.update(id, category);
      return id;
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  async delete(id: number, projectId: number) {
    const category = await this.getOneByIdOrFail(id, projectId);
    try {
      category.isDeleted = category.id;
      await this.repo.update(id, category);
      return id;
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException('Internal Server Error');
    }
  }
}
