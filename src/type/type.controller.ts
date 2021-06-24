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
import { TypeService } from './type.service';
import { AddTypeDTO } from './dto/add-type.dto';
import { EditTypeDTO } from './dto/edit-type.dto';

@ApiTags('Type')
@Controller('projects/:idProject/types')
export class TypeController {
  constructor(private typeService: TypeService) {}

  @Get()
  async getAll() {
    return await this.typeService.getAll();
  }

  @Get(':id')
  async getTypeById(@Param('id') id: number) {
    return await this.typeService.getOneByIdOrFail(id);
  }

  @Post()
  async createType(@Body() dto: AddTypeDTO) {
    return await this.typeService.add(dto);
  }

  @Post(':id')
  async addTypeInProject(
    @Param('id') id: number,
    @Param('idProject') idProject: number,
  ) {
    return this.typeService.addTypeInProject(id, idProject);
  }

  @Put(':id')
  @UsePipes(ValidationPipe)
  async editType(
    @Param('idProject') idProject: number,
    @Param('id') id: number,
    @Body() dto: EditTypeDTO,
  ) {
    return await this.typeService.edit(id, idProject, dto);
  }

  @Delete(':id')
  @UsePipes(ValidationPipe)
  async removeType(
    @Param('idProject') idProject: number,
    @Param('id') id: number,
  ) {
    return await this.typeService.remove(id, idProject);
  }
}
