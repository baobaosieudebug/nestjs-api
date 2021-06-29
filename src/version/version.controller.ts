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
import { VersionService } from './version.service';
import { AddVersionDTO } from './dto/add-version.dto';
import { EditVersionDTO } from './dto/edit-version.dto';

@ApiTags('Version')
@Controller('projects/:id/versions')
export class VersionController {
  constructor(private versionService: VersionService) {}

  @Get()
  async getAll(@Param('id') projectId: number) {
    return await this.versionService.getAllVersionByIdProject(projectId);
  }

  @Get(':idVersion')
  async getVersionById(
    @Param('idVersion') id: number,
    @Param('id') projectId: number,
  ) {
    return await this.versionService.getOneByIdOrFail(id, projectId);
  }

  @Get(':code')
  async getVersionByCode(
    @Param('code') code: string,
    @Param('id') projectId: number,
  ) {
    return await this.versionService.getOneByCodeOrFail(code, projectId);
  }

  @Post()
  @UsePipes(ValidationPipe)
  async createVersion(
    @Body() dto: AddVersionDTO,
    @Param('id') projectId: number,
  ) {
    return await this.versionService.add(dto, projectId);
  }

  @Put(':idVersion')
  @UsePipes(ValidationPipe)
  async editVersion(
    @Param('id') projectId: number,
    @Param('idVersion') id: number,
    @Body() dto: EditVersionDTO,
  ) {
    return await this.versionService.edit(id, projectId, dto);
  }

  @Delete(':idVersion')
  async removeVersion(
    @Param('id') projectId: number,
    @Param('idVersion') id: number,
  ) {
    return await this.versionService.remove(id, projectId);
  }
}
