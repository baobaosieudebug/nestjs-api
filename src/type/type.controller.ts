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
    @Param('id') projectId: number,
  ) {
    return await this.typeService.getOneByIdOrFail(id, projectId);
  }

  @Get(':code')
  async getTypeByCode(
    @Param('code') code: string,
    @Param('id') projectId: number,
  ) {
    return await this.typeService.getOneByCodeOrFail(code, projectId);
  }

  @Post()
  @UsePipes(ValidationPipe)
  async createType(@Body() dto: AddTypeDTO, @Param('id') projectId: number) {
    return await this.typeService.add(dto, projectId);
  }

  @Put(':idType')
  @UsePipes(ValidationPipe)
  async editType(
    @Param('id') projectId: number,
    @Param('idType') id: number,
    @Body() dto: EditTypeDTO,
  ) {
    return await this.typeService.edit(id, projectId, dto);
  }

  @Delete(':idType')
  async removeType(
    @Param('id') projectId: number,
    @Param('idType') id: number,
  ) {
    return await this.typeService.remove(id, projectId);
  }
}
