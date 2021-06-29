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
import { TypeService } from './type.service';
import { AddTypeDTO } from './dto/add-type.dto';
import { EditTypeDTO } from './dto/edit-type.dto';

@ApiTags('Type')
@ApiOkResponse({ description: 'Success' })
@ApiCreatedResponse({ description: 'Created' })
@ApiNotFoundResponse({ description: 'Not Found' })
@ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
@Controller('projects/:id/types')
export class TypeController {
  constructor(private typeService: TypeService) {}

  @Get()
  async getAll(@Param('id') projectId: number) {
    return await this.typeService.getAllTypeByIdProject(projectId);
  }

  @Get(':idType')
  async getTypeById(
    @Param('idType') id: number,
    @Param('id') idProject: number,
  ) {
    return await this.typeService.getOneByIdOrFail(id, idProject);
  }

  @Get(':code')
  async getTypeByCode(
    @Param('code') code: string,
    @Param('id') idProject: number,
  ) {
    return await this.typeService.getOneByCodeOrFail(code, idProject);
  }

  @Post()
  @UsePipes(ValidationPipe)
  async createType(@Body() dto: AddTypeDTO, @Param('id') idProject: number) {
    return await this.typeService.add(dto, idProject);
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
  async removeType(
    @Param('id') idProject: number,
    @Param('idType') id: number,
  ) {
    return await this.typeService.remove(id, idProject);
  }
}
