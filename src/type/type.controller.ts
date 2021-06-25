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
@Controller('projects/:id/types')
export class TypeController {
  constructor(private typeService: TypeService) {}

  @Get()
  async getAll() {
    return await this.typeService.getAll();
  }

  @Get(':idType')
  async getTypeById(@Param('idType') id: number) {
    return await this.typeService.getOneByIdOrFail(id);
  }

  @Post()
  async createType(@Body() dto: AddTypeDTO) {
    return await this.typeService.add(dto);
  }

  @Post(':idType')
  async addTypeInProject(
    @Param('idType') id: number,
    @Param('id') idProject: number,
  ) {
    return this.typeService.addTypeInProject(id, idProject);
  }

  @Put(':idType')
  @UsePipes(ValidationPipe)
  async editType(
    @Param('id') idProject: number,
    @Param('idType') id: number,
    @Body() dto: EditTypeDTO,
  ) {
    return await this.typeService.edit(id, idProject, dto);
  }

  @Delete(':idType')
  @UsePipes(ValidationPipe)
  async removeType(
    @Param('id') idProject: number,
    @Param('idType') id: number,
  ) {
    return await this.typeService.remove(id, idProject);
  }
}
