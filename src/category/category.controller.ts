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
  async getAll(@Param('id') idProject: number) {
    return await this.categoryService.getAll(idProject);
  }

  @Get(':idCategory')
  async getCategoryById(
    @Param('idCategory') id: number,
    @Param('id') idProject: number,
  ) {
    return await this.categoryService.getOneByIdOrFail(id, idProject);
  }

  @Post()
  @UsePipes(ValidationPipe)
  async createCategory(
    @Body() dto: AddCategoryDTO,
    @Param('id') idProject: number,
  ) {
    return await this.categoryService.add(dto, idProject);
  }

  @Put(':idCategory')
  @UsePipes(ValidationPipe)
  async editCategory(
    @Param('id') idProject: number,
    @Param('idCategory') id: number,
    @Body() dto: EditCategoryDTO,
  ) {
    return await this.categoryService.edit(id, idProject, dto);
  }

  @Delete(':idCategory')
  async removeCategory(
    @Param('id') idProject: number,
    @Param('idCategory') id: number,
  ) {
    return await this.categoryService.remove(id, idProject);
  }
}
