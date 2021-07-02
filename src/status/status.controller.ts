import {
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Body, Controller, Delete, Get, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import { StatusService } from './status.service';
import { AddStatusDTO } from './dto/add-status.dto';
import { EditStatusDTO } from './dto/edit-status.dto';
import { GetStatusRO } from './ro/get-status.ro';
import { HandleStatusRO } from './ro/handle-status.ro';

@ApiTags('Status')
@ApiNotFoundResponse({ description: 'Not Found' })
@ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
@Controller('projects/:projectId/categories')
export class StatusController {
  constructor(private statusService: StatusService) {}

  @ApiOkResponse({ description: 'Success' })
  @Get()
  async getAll(@Param('projectId') projectId: number): Promise<GetStatusRO[]> {
    return await this.statusService.getAllStatusByIdProject(projectId);
  }

  @ApiOkResponse({ description: 'Success' })
  @Get(':id')
  async getStatusById(@Param('projectId') projectId: number, @Param('id') id: number): Promise<GetStatusRO> {
    const status = await this.statusService.getOneByIdOrFail(projectId, id);
    return await this.statusService.getStatusResponse(status);
  }

  @ApiOkResponse({ description: 'Success' })
  @Get(':code')
  async getStatusByCode(@Param('projectId') projectId: number, @Param('code') code: string): Promise<GetStatusRO> {
    const status = await this.statusService.getOneByCodeOrFail(projectId, code);
    return await this.statusService.getStatusResponse(status);
  }

  @ApiCreatedResponse({ description: 'Created' })
  @Post()
  @UsePipes(ValidationPipe)
  async create(@Param('projectId') projectId: number, @Body() dto: AddStatusDTO): Promise<HandleStatusRO> {
    return await this.statusService.add(projectId, dto);
  }

  @ApiOkResponse({ description: 'Success' })
  @Put(':id')
  @UsePipes(ValidationPipe)
  async edit(
    @Param('projectId') projectId: number,
    @Param('id') id: number,
    @Body() dto: EditStatusDTO,
  ): Promise<HandleStatusRO> {
    return await this.statusService.edit(projectId, id, dto);
  }

  @ApiOkResponse({ description: 'Success' })
  @Delete(':id')
  async delete(@Param('projectId') projectId: number, @Param('id') id: number): Promise<number> {
    return await this.statusService.delete(projectId, id);
  }
}
