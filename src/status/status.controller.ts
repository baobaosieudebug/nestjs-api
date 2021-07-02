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
    const status = await this.statusService.getOneByIdOrFail(id, projectId);
    return await this.statusService.getStatusResponse(status);
  }

  @ApiOkResponse({ description: 'Success' })
  @Get(':code')
  async getStatusByCode(@Param('projectId') projectId: number, @Param('code') code: string): Promise<GetStatusRO> {
    const status = await this.statusService.getOneByCodeOrFail(code, projectId);
    return await this.statusService.getStatusResponse(status);
  }

  @ApiCreatedResponse({ description: 'Created' })
  @Post()
  @UsePipes(ValidationPipe)
  async createStatus(@Param('projectId') projectId: number, @Body() dto: AddStatusDTO): Promise<HandleStatusRO> {
    return await this.statusService.add(dto, projectId);
  }

  @ApiOkResponse({ description: 'Success' })
  @Put(':id')
  @UsePipes(ValidationPipe)
  async editStatus(
    @Param('projectId') projectId: number,
    @Param('id') id: number,
    @Body() dto: EditStatusDTO,
  ): Promise<HandleStatusRO> {
    return await this.statusService.edit(id, projectId, dto);
  }

  @ApiOkResponse({ description: 'Success' })
  @Delete(':id')
  async deleteStatus(@Param('projectId') projectId: number, @Param('id') id: number): Promise<HandleStatusRO> {
    return await this.statusService.delete(id, projectId);
  }
}
