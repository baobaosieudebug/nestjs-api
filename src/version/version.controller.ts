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
    const version = await this.versionService.getOneByIdOrFail(id, projectId);
    return await this.versionService.getVersionResponse(version);
  }

  @ApiOkResponse({ description: 'Success' })
  @Get(':code')
  async getVersionByCode(@Param('projectId') projectId: number, @Param('code') code: string): Promise<GetVersionRO> {
    const version = await this.versionService.getOneByCodeOrFail(code, projectId);
    return await this.versionService.getVersionResponse(version);
  }

  @ApiCreatedResponse({ description: 'Created' })
  @Post()
  @UsePipes(ValidationPipe)
  async createVersion(@Param('projectId') projectId: number, @Body() dto: AddVersionDTO): Promise<HandleVersionRO> {
    return await this.versionService.add(dto, projectId);
  }

  @ApiOkResponse({ description: 'Success' })
  @Put(':id')
  @UsePipes(ValidationPipe)
  async editVersion(
    @Param('projectId') projectId: number,
    @Param('id') id: number,
    @Body() dto: EditVersionDTO,
  ): Promise<HandleVersionRO> {
    return await this.versionService.edit(id, projectId, dto);
  }

  @ApiOkResponse({ description: 'Success' })
  @Delete(':id')
  async deleteVersion(@Param('projectId') projectId: number, @Param('id') id: number): Promise<HandleVersionRO> {
    return await this.versionService.delete(id, projectId);
  }
}
