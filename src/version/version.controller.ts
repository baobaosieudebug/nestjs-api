import {
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Body, Controller, Delete, Get, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { VersionService } from './version.service';
import { AddVersionDTO } from './dto/add-version.dto';
import { EditVersionDTO } from './dto/edit-version.dto';
import { GetVersionRO } from './ro/get-version.ro';
import { HandleVersionRO } from './ro/handle-version.ro';

@ApiTags('Version')
@ApiNotFoundResponse({ description: 'Not Found' })
@ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
@Controller('projects/:projectId/categories')
export class VersionController {
  constructor(private versionService: VersionService) {}

  @ApiOkResponse({ description: 'Success' })
  @Get()
  async getAll(@Param('projectId') projectId: number): Promise<GetVersionRO[]> {
    return await this.versionService.getAllVersionByIdProject(projectId);
  }

  @ApiOkResponse({ description: 'Success' })
  @Get(':id')
  async getVersionById(@Param('projectId') projectId: number, @Param('id') id: number): Promise<GetVersionRO> {
    const version = await this.versionService.getOneByIdOrFail(projectId, id);
    return await this.versionService.getVersionResponse(version);
  }

  @ApiOkResponse({ description: 'Success' })
  @Get(':code')
  async getVersionByCode(@Param('projectId') projectId: number, @Param('code') code: string): Promise<GetVersionRO> {
    const version = await this.versionService.getOneByCodeOrFail(projectId, code);
    return await this.versionService.getVersionResponse(version);
  }

  @ApiCreatedResponse({ description: 'Created' })
  @Post()
  @UsePipes(ValidationPipe)
  async create(@Param('projectId') projectId: number, @Body() dto: AddVersionDTO): Promise<HandleVersionRO> {
    return await this.versionService.add(projectId, dto);
  }

  @ApiOkResponse({ description: 'Success' })
  @Put(':id')
  @UsePipes(ValidationPipe)
  async edit(
    @Param('projectId') projectId: number,
    @Param('id') id: number,
    @Body() dto: EditVersionDTO,
  ): Promise<HandleVersionRO> {
    return await this.versionService.edit(projectId, id, dto);
  }

  @ApiOkResponse({ description: 'Success' })
  @Delete(':id')
  async delete(@Param('projectId') projectId: number, @Param('id') id: number): Promise<number> {
    return await this.versionService.delete(projectId, id);
  }
}
