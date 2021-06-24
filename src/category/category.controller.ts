import { ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { AddCategoryDTO } from './dto/add-category.dto';
import { EditCategoryDTO } from './dto/edit-category.dto';

@ApiTags('Category')
@Controller('projects/:idProject')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get('categories')
  async getAll(@Param('idProject') id: number) {
    return await this.categoryService.getAll(id);
  }

  @Get(':id')
  async getCategoryById(@Param('id') id: number) {
    return await this.categoryService.getOneByIdOrFail(id);
  }

  @Post()
  async createCategory(@Body() dto: AddCategoryDTO) {
    return await this.categoryService.add(dto);
  }

  @Post('categories/:id')
  async addCategoryInProject(
    @Param('id') id: number,
    @Param('idProject') idProject: number,
  ) {
    return this.categoryService.addCategoryInProject(id, idProject);
  }

  @Put(':id')
  async editCategory(@Param('id') id: number, @Body() dto: EditCategoryDTO) {
    return await this.categoryService.edit(id, dto);
  }

  @Delete(':id')
  async removeCategory(@Param('id') id: number) {
    return await this.categoryService.remove(id);
  }
}
