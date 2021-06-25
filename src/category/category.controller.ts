import { ApiTags } from '@nestjs/swagger';
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
@Controller('projects/:id/categories')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get()
  async getAll() {
    return await this.categoryService.getAll();
  }

  @Get(':idCategory')
  async getCategoryById(@Param('idCategory') id: number) {
    return await this.categoryService.getOneByIdOrFail(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  async createCategory(@Body() dto: AddCategoryDTO) {
    return await this.categoryService.add(dto);
  }

  @Post(':idCategory')
  async addCategoryInProject(
    @Param('idCategory') id: number,
    @Param('id') idProject: number,
  ) {
    return this.categoryService.addCategoryInProject(id, idProject);
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
