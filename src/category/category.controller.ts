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
@Controller('projects/:idProject/categories')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get('')
  async getAll(@Param('idProject') id: number) {
    return await this.categoryService.getAll(id);
  }

  @Get(':id')
  async getCategoryById(@Param('id') id: number) {
    return await this.categoryService.getOneByIdOrFail(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  async createCategory(@Body() dto: AddCategoryDTO) {
    return await this.categoryService.add(dto);
  }

  @Post(':id')
  async addCategoryInProject(
    @Param('id') id: number,
    @Param('idProject') idProject: number,
  ) {
    return this.categoryService.addCategoryInProject(id, idProject);
  }

  @Put(':id')
  @UsePipes(ValidationPipe)
  async editCategory(
    @Param('idProject') idProject: number,
    @Param('id') id: number,
    @Body() dto: EditCategoryDTO,
  ) {
    return await this.categoryService.edit(id, idProject, dto);
  }

  @Delete(':id')
  async removeCategory(
    @Param('idProject') idProject: number,
    @Param('id') id: number,
  ) {
    return await this.categoryService.remove(id, idProject);
  }
}
