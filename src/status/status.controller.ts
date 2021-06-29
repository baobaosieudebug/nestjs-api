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
import { StatusService } from './status.service';
import { AddStatusDTO } from './dto/add-status.dto';
import { EditStatusDTO } from './dto/edit-status.dto';

@ApiTags('Status')
@ApiOkResponse({ description: 'Success' })
@ApiCreatedResponse({ description: 'Created' })
@ApiNotFoundResponse({ description: 'Not Found' })
@ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
@Controller('projects/:id/statuses')
export class StatusController {
  constructor(private statusService: StatusService) {}

  @Get()
  async getAll(@Param('id') projectId: number) {
    return await this.statusService.getAllStatusByIdProject(projectId);
  }

  @Get(':idStatus')
  async getStatusById(
    @Param('idStatus') id: number,
    @Param('id') projectId: number,
  ) {
    return await this.statusService.getOneByIdOrFail(id, projectId);
  }

  @Get(':code')
  async getStatusByCode(
    @Param('code') code: string,
    @Param('id') projectId: number,
  ) {
    return await this.statusService.getOneByCodeOrFail(code, projectId);
  }
  @Post()
  @UsePipes(ValidationPipe)
  async createStatus(
    @Body() dto: AddStatusDTO,
    @Param('id') projectId: number,
  ) {
    return await this.statusService.add(dto, projectId);
  }

  @Put(':idStatus')
  @UsePipes(ValidationPipe)
  async editStatus(
    @Param('id') projectId: number,
    @Param('idStatus') id: number,
    @Body() dto: EditStatusDTO,
  ) {
    return await this.statusService.edit(id, projectId, dto);
  }

  @Delete(':idStatus')
  async removeStatus(
    @Param('id') projectId: number,
    @Param('idStatus') id: number,
  ) {
    return await this.statusService.remove(id, projectId);
  }
}
