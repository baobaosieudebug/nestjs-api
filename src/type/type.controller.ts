import {
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Body, Controller, Delete, Get, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { TypeService } from './type.service';
import { AddTypeDTO } from './dto/add-type.dto';
import { EditTypeDTO } from './dto/edit-type.dto';
import { GetTypeRO } from './ro/get-type.ro';
import { HandleTypeRO } from './ro/handle-type.ro';

@ApiTags('Type')
@ApiNotFoundResponse({ description: 'Not Found' })
@ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
@Controller('projects/:projectId/categories')
export class TypeController {
  constructor(private typeService: TypeService) {}

  @ApiOkResponse({ description: 'Success' })
  @Get()
  async getAll(@Param('projectId') projectId: number): Promise<GetTypeRO[]> {
    return await this.typeService.getAllTypeByIdProject(projectId);
  }

  @ApiOkResponse({ description: 'Success' })
  @Get(':id')
  async getTypeById(@Param('projectId') projectId: number, @Param('id') id: number): Promise<GetTypeRO> {
    const type = await this.typeService.getOneByIdOrFail(id, projectId);
    return await this.typeService.getTypeResponse(type);
  }

  @ApiOkResponse({ description: 'Success' })
  @Get(':code')
  async getTypeByCode(@Param('projectId') projectId: number, @Param('code') code: string): Promise<GetTypeRO> {
    const type = await this.typeService.getOneByCodeOrFail(code, projectId);
    return await this.typeService.getTypeResponse(type);
  }

  @ApiCreatedResponse({ description: 'Created' })
  @Post()
  @UsePipes(ValidationPipe)
  async createType(@Param('projectId') projectId: number, @Body() dto: AddTypeDTO): Promise<HandleTypeRO> {
    return await this.typeService.add(dto, projectId);
  }

  @ApiOkResponse({ description: 'Success' })
  @Put(':id')
  @UsePipes(ValidationPipe)
  async editType(
    @Param('projectId') projectId: number,
    @Param('id') id: number,
    @Body() dto: EditTypeDTO,
  ): Promise<HandleTypeRO> {
    return await this.typeService.edit(id, projectId, dto);
  }

  @ApiOkResponse({ description: 'Success' })
  @Delete(':id')
  async deleteType(@Param('projectId') projectId: number, @Param('id') id: number): Promise<HandleTypeRO> {
    return await this.typeService.delete(id, projectId);
  }
}
