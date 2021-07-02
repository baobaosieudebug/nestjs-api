import {
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Body, Controller, Delete, Get, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { CategoryService } from './category.service';
import { AddCategoryDTO } from './dto/add-category.dto';
import { EditCategoryDTO } from './dto/edit-category.dto';
import { GetCategoryRO } from './ro/get-category.ro';
import { HandleCategoryRO } from './ro/handle-category.ro';

@ApiTags('Category')
@ApiNotFoundResponse({ description: 'Not Found' })
@ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
@Controller('projects/:projectId/categories')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @ApiOkResponse({ description: 'Success' })
  @Get()
  async getAll(@Param('projectId') projectId: number): Promise<GetCategoryRO[]> {
    return await this.categoryService.getAllCategoryByIdProject(projectId);
  }

  @ApiOkResponse({ description: 'Success' })
  @Get(':id')
  async getCategoryById(@Param('projectId') projectId: number, @Param('id') id: number): Promise<GetCategoryRO> {
    const category = await this.categoryService.getOneByIdOrFail(id, projectId);
    return await this.categoryService.getCategoryResponse(category);
  }

  @ApiOkResponse({ description: 'Success' })
  @Get(':code')
  async getCategoryByCode(@Param('projectId') projectId: number, @Param('code') code: string): Promise<GetCategoryRO> {
    const category = await this.categoryService.getOneByCodeOrFail(code, projectId);
    return await this.categoryService.getCategoryResponse(category);
  }

  @ApiCreatedResponse({ description: 'Created' })
  @Post()
  @UsePipes(ValidationPipe)
  async createCategory(@Param('projectId') projectId: number, @Body() dto: AddCategoryDTO): Promise<HandleCategoryRO> {
    return await this.categoryService.add(dto, projectId);
  }

  @ApiOkResponse({ description: 'Success' })
  @Put(':id')
  @UsePipes(ValidationPipe)
  async editCategory(
    @Param('projectId') projectId: number,
    @Param('id') id: number,
    @Body() dto: EditCategoryDTO,
  ): Promise<HandleCategoryRO> {
    return await this.categoryService.edit(id, projectId, dto);
  }

  @ApiOkResponse({ description: 'Success' })
  @Delete(':id')
  async deleteCategory(@Param('projectId') projectId: number, @Param('id') id: number): Promise<HandleCategoryRO> {
    return await this.categoryService.delete(id, projectId);
  }
}
