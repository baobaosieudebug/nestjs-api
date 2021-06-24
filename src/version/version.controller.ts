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
@Controller('projects/:idProject/versions')
export class VersionController {
  constructor(private versionService: VersionService) {}

  @Get()
  async getAll() {
    return await this.versionService.getAll();
  }

  @Get(':id')
  async getVersionById(@Param('id') id: number) {
    return await this.versionService.getOneByIdOrFail(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  async createVersion(@Body() dto: AddVersionDTO) {
    return await this.versionService.add(dto);
  }

  @Post(':id')
  async addVersionInProject(
    @Param('id') id: number,
    @Param('idProject') idProject: number,
  ) {
    return this.versionService.addVersionInProject(id, idProject);
  }

  @Put(':id')
  @UsePipes(ValidationPipe)
  async editVersion(
    @Param('idProject') idProject: number,
    @Param('id') id: number,
    @Body() dto: EditVersionDTO,
  ) {
    return await this.versionService.edit(id, idProject, dto);
  }

  @Delete(':id')
  async removeVersion(
    @Param('idProject') idProject: number,
    @Param('id') id: number,
  ) {
    return await this.versionService.remove(id, idProject);
  }
}
