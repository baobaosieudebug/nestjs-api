import {
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

  async checkExistCode(code: string, projectId: number) {
    const checkExist = await this.categoryRepo.isCategoryExistCode(
      code,
      projectId,
    );
    if (!checkExist) {
      throw new NotFoundException('Category not found');
    }
    return checkExist;
  }

  async checkExistId(id: number, projectId: number) {
    const checkExist = await this.categoryRepo.isCategoryExistId(id, projectId);
    if (!checkExist) {
      throw new NotFoundException('Category not found');
    }
    return checkExist;
  }

  async add(dto: AddCategoryDTO, projectId: number) {
    const checkExist = await this.checkExistCode(dto.code, projectId);
    if (checkExist) {
      throw new NotFoundException('Code must be unique');
    }
    try {
      const newCategory = this.categoryRepo.create(dto);
      newCategory.projectId = projectId;
      return await this.categoryRepo.save(newCategory);
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async edit(id: number, projectId: number, dto: EditCategoryDTO) {
    const checkExist = await this.checkExistCode(dto.code, projectId);
    if (checkExist) {
      try {
        return await this.categoryRepo.update(id, dto);
      } catch (e) {
        throw new InternalServerErrorException();
      }
    }
  }

  async remove(id: number, projectId: number) {
    const checkExist = await this.checkExistId(id, projectId);
    if (checkExist) {
      try {
        await this.categoryRepo.update(id, { isDeleted: id });
        return id;
      } catch (e) {
        throw new InternalServerErrorException();
      }
    }
  }
}
