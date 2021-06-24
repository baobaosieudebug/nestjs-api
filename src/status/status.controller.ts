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
@Controller('projects/:idProject/statuses')
export class StatusController {
  constructor(private statusService: StatusService) {}

  @Get()
  async getAll() {
    return await this.statusService.getAll();
  }
  @Get(':id')
  async getStatusById(@Param('idStatus') id: number) {
    return await this.statusService.getOneByIdOrFail(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  async createStatus(@Body() dto: AddStatusDTO) {
    return await this.statusService.add(dto);
  }

  @Post(':id')
  async addStatusInProject(
    @Param('id') id: number,
    @Param('idProject') idProject: number,
  ) {
    return this.statusService.addStatusInProject(id, idProject);
  }

  @Put(':id')
  @UsePipes(ValidationPipe)
  async editStatus(
    @Param('idProject') idProject: number,
    @Param('id') id: number,
    @Body() dto: EditStatusDTO,
  ) {
    return await this.statusService.edit(id, idProject, dto);
  }

  @Delete(':id')
  async removeStatus(
    @Param('idProject') idProject: number,
    @Param('id') id: number,
  ) {
    return await this.statusService.remove(id, idProject);
  }
}
