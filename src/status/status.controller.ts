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
import { StatusService } from './status.service';
import { AddStatusDTO } from './dto/add-status.dto';
import { EditStatusDTO } from './dto/edit-status.dto';

@ApiTags('Status')
@Controller('projects/:id/statuses')
export class StatusController {
  constructor(private statusService: StatusService) {}

  @Get()
  async getAll() {
    return await this.statusService.getAll();
  }

  @Get(':idStatus')
  async getStatusById(@Param('idStatus') id: number) {
    return await this.statusService.getOneByIdOrFail(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  async createStatus(@Body() dto: AddStatusDTO) {
    return await this.statusService.add(dto);
  }

  @Post(':idStatus')
  async addStatusInProject(
    @Param('idStatus') id: number,
    @Param('id') idProject: number,
  ) {
    return this.statusService.addStatusInProject(id, idProject);
  }

  @Put(':idStatus')
  @UsePipes(ValidationPipe)
  async editStatus(
    @Param('id') idProject: number,
    @Param('idStatus') id: number,
    @Body() dto: EditStatusDTO,
  ) {
    return await this.statusService.edit(id, idProject, dto);
  }

  @Delete(':idStatus')
  async removeStatus(
    @Param('id') idProject: number,
    @Param('idStatus') id: number,
  ) {
    return await this.statusService.remove(id, idProject);
  }
}
