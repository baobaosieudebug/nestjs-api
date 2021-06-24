import { ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { VersionService } from './version.service';
import { AddVersionDTO } from './dto/add-version.dto';
import { EditVersionDTO } from './dto/edit-version.dto';

@ApiTags('Version')
@Controller('version')
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
  async createVersion(@Body() dto: AddVersionDTO) {
    return await this.versionService.add(dto);
  }

  @Put(':id')
  async editVersion(@Param('id') id: number, @Body() dto: EditVersionDTO) {
    return await this.versionService.edit(id, dto);
  }

  @Delete(':id')
  async removeVersion(@Param('id') id: number) {
    return await this.versionService.remove(id);
  }
}
