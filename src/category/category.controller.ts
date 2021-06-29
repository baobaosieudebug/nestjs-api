import {
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { AddCategoryDTO } from './dto/add-category.dto';
import { EditCategoryDTO } from './dto/edit-category.dto';

@ApiTags('Category')
@ApiOkResponse({ description: 'Success' })
@ApiCreatedResponse({ description: 'Created' })
@ApiNotFoundResponse({ description: 'Not Found' })
@ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
@Controller('projects/:id/categories')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get()
  async getAll(@Param('id') projectId: number) {
    return await this.categoryService.getAllCategoryByIdProject(projectId);
  }

  @Get(':idCategory')
  async getCategoryById(
    @Param('idCategory') id: number,
    @Param('id') projectId: number,
  ) {
    return await this.categoryService.getOneByIdOrFail(id, projectId);
  }

  @Get(':code')
  async getCategoryByCode(
    @Param('code') code: string,
    @Param('id') projectId: number,
  ) {
    return await this.categoryService.getOneByCodeOrFail(code, projectId);
  }

  @Post()
  @UsePipes(ValidationPipe)
  async createCategory(
    @Body() dto: AddCategoryDTO,
    @Param('id') projectId: number,
  ) {
    return await this.categoryService.add(dto, projectId);
  }

  @Put(':idCategory')
  @UsePipes(ValidationPipe)
  async editCategory(
    @Param('id') projectId: number,
    @Param('idCategory') id: number,
    @Body() dto: EditCategoryDTO,
  ) {
    return await this.categoryService.edit(id, projectId, dto);
  }

  @Delete(':idCategory')
  async removeCategory(
    @Param('id') projectId: number,
    @Param('idCategory') id: number,
  ) {
    return await this.categoryService.remove(id, projectId);
  }
}
