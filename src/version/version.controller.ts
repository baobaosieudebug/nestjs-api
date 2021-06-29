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
    @Param('id') idProject: number,
  ) {
    return await this.versionService.getOneByIdOrFail(id, idProject);
  }

  @Get(':code')
  async getVersionByCode(
    @Param('code') code: string,
    @Param('id') idProject: number,
  ) {
    return await this.versionService.getOneByCodeOrFail(code, idProject);
  }

  @Post()
  @UsePipes(ValidationPipe)
  async createVersion(
    @Body() dto: AddVersionDTO,
    @Param('id') idProject: number,
  ) {
    return await this.versionService.add(dto, idProject);
  }

  @Put(':idVersion')
  @UsePipes(ValidationPipe)
  async editVersion(
    @Param('id') idProject: number,
    @Param('idVersion') id: number,
    @Body() dto: EditVersionDTO,
  ) {
    return await this.versionService.edit(id, idProject, dto);
  }

  @Delete(':idVersion')
  async removeVersion(
    @Param('id') idProject: number,
    @Param('idVersion') id: number,
  ) {
    return await this.versionService.remove(id, idProject);
  }
}
