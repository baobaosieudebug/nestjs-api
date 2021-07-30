import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CategoryRepository } from './category.repository';
import { AddCategoryDTO } from './dto/add-category.dto';
import { EditCategoryDTO } from './dto/edit-category.dto';
import { CategoryEntity } from './category.entity';
import { GetCategoryRO } from './ro/get-category.ro';
import { HandleCategoryRO } from './ro/handle-category.ro';
import { AuthService } from '../auth/auth.service';
import { ActionRepository } from '../auth/repository/action.repository';
import { ResourceRepository } from '../auth/repository/resource.repository';

@Injectable()
export class CategoryService {
  private readonly logger = new Logger(CategoryService.name);
  constructor(
    private readonly repo: CategoryRepository,
    private readonly authService: AuthService,
    private readonly actionRepo: ActionRepository,
    private readonly resourceRepo: ResourceRepository,
  ) {}

  async getAllCategoryByIdProject(projectId: number): Promise<GetCategoryRO[]> {
    const oldArray = await this.repo.getAll(projectId);
    const newArray: GetCategoryRO[] = [];
    for (let i = 0; i < oldArray.length; i++) {
      const categoryRO = await this.getCategoryResponse(oldArray[i]);
      newArray.push(categoryRO);
    }
    return newArray;
  }

  async getOneById(projectId: number, id: number): Promise<CategoryEntity> {
    return await this.repo.getById(id, projectId);
  }

  async getOneByCode(projectId: number, code: string): Promise<CategoryEntity> {
    return await this.repo.getByCode(code, projectId);
  }

  async getOneByIdOrFail(projectId: number, id: number): Promise<CategoryEntity> {
    const category = await this.getOneById(id, projectId);
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  async getOneByCodeOrFail(projectId: number, code: string): Promise<CategoryEntity> {
    const category = await this.getOneByCode(projectId, code);
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  async getCategoryResponse(category: CategoryEntity): Promise<GetCategoryRO> {
    const response = new GetCategoryRO();
    response.name = category.name;
    response.code = category.code;
    response.description = category.description;
    return response;
  }

  async handleCategoryResponse(category: CategoryEntity): Promise<HandleCategoryRO> {
    const response = new HandleCategoryRO();
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

  async isExistPermission(actionId: number, resourceId: number, roleId: number) {
    const isExistPermission = await this.authService.isExistPermission(actionId, resourceId, roleId);
    if (!isExistPermission) {
      throw new ForbiddenException('Forbidden');
    }
  }

  async add(payload, projectId: number, dto: AddCategoryDTO): Promise<HandleCategoryRO> {
    const resourceId = await this.resourceRepo.getIdByCode('category');
    const actionId = await this.actionRepo.getIdByCode('create', resourceId);
    await this.isExistPermission(actionId, resourceId, payload.role);
    await this.checkExistCode(projectId, dto.code);
    try {
      const newCategory = this.repo.create(dto);
      newCategory.projectId = projectId;
      await this.repo.save(newCategory);
      return this.handleCategoryResponse(newCategory);
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  async edit(payload, projectId: number, id: number, dto: EditCategoryDTO): Promise<HandleCategoryRO> {
    const resourceId = await this.resourceRepo.getIdByCode('category');
    const actionId = await this.actionRepo.getIdByCode('edit', resourceId);
    await this.isExistPermission(actionId, resourceId, payload.role);
    const old = await this.getOneByIdOrFail(id, projectId);
    await this.checkExistCode(projectId, dto.code, id);
    try {
      const category = await this.repo.merge(old, dto);
      await this.repo.update(id, category);
      return this.handleCategoryResponse(category);
    } catch (e) {
      this.logger.error(e);
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  async delete(payload, projectId: number, id: number): Promise<number> {
    const resourceId = await this.resourceRepo.getIdByCode('category');
    const actionId = await this.actionRepo.getIdByCode('delete', resourceId);
    await this.isExistPermission(actionId, resourceId, payload.role);
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
