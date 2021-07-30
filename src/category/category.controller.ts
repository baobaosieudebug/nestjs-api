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
import { Payload } from '../decorators/payload.decorator';

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
    const category = await this.categoryService.getOneByIdOrFail(projectId, id);
    return await this.categoryService.getCategoryResponse(category);
  }

  @ApiOkResponse({ description: 'Success' })
  @Get(':code')
  async getCategoryByCode(@Param('projectId') projectId: number, @Param('code') code: string): Promise<GetCategoryRO> {
    const category = await this.categoryService.getOneByCodeOrFail(projectId, code);
    return await this.categoryService.getCategoryResponse(category);
  }

  @ApiCreatedResponse({ description: 'Created' })
  @Post()
  @UsePipes(ValidationPipe)
  async create(
    @Payload() payload,
    @Param('projectId') projectId: number,
    @Body() dto: AddCategoryDTO,
  ): Promise<HandleCategoryRO> {
    return await this.categoryService.add(payload, projectId, dto);
  }

  @ApiOkResponse({ description: 'Success' })
  @Put(':id')
  @UsePipes(ValidationPipe)
  async edit(
    @Payload() payload,
    @Param('projectId') projectId: number,
    @Param('id') id: number,
    @Body() dto: EditCategoryDTO,
  ): Promise<HandleCategoryRO> {
    return await this.categoryService.edit(payload, projectId, id, dto);
  }

  @ApiOkResponse({ description: 'Success' })
  @Delete(':id')
  async delete(@Payload() payload, @Param('projectId') projectId: number, @Param('id') id: number): Promise<number> {
    return await this.categoryService.delete(payload, projectId, id);
  }
}
