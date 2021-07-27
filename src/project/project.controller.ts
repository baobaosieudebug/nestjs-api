import { Body, Controller, Get, Param, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Payload } from '../decorators/payload.decorator';
import { ProjectService } from './project.service';
import { AddProjectDTO } from './dto/add-project.dto';
import { EditProjectDTO } from './dto/edit-project.dto';
import { ProjectRO } from './ro/project.ro';
import { UserRO } from '../user/ro/user.ro';

@ApiTags('Project')
@ApiNotFoundResponse({ description: 'Not Found' })
@ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
@Controller('project')
export class ProjectController {
  constructor(private projectService: ProjectService) {}

  @Get('users')
  async getListUserByUser(@Payload() payload, @Query('projectCode') projectCode: string): Promise<UserRO[]> {
    return await this.projectService.getListUserByUser(payload, projectCode);
  }

  @ApiOkResponse({ description: 'Success' })
  @Get(':code')
  async getInfo(@Payload() payload, @Param('code') code: string): Promise<ProjectRO> {
    return await this.projectService.getInfo(payload, code);
  }

  @ApiCreatedResponse({ description: 'Created' })
  @Post()
  @UsePipes(ValidationPipe)
  async create(@Payload() payload, @Body() dto: AddProjectDTO): Promise<ProjectRO> {
    return await this.projectService.create(payload, dto);
  }

  @ApiOkResponse({ description: 'Success' })
  @Post(':projectCode/users/:id')
  @UsePipes(ValidationPipe)
  async addUser(
    @Payload() payload,
    @Param('projectCode') projectCode: string,
    @Param('id') id: number,
  ): Promise<UserRO> {
    return await this.projectService.addUser(payload, projectCode, id);
  }

  @ApiOkResponse({ description: 'Success' })
  @Get(':code/users')
  async getListUser(@Payload() payload, @Param('code') code: string): Promise<UserRO[]> {
    return await this.projectService.getListUser(payload, code);
  }

  @ApiOkResponse({ description: 'Success' })
  @Get()
  async getList(@Payload() payload): Promise<ProjectRO[]> {
    return await this.projectService.getList(payload);
  }

  @ApiOkResponse({ description: 'Success' })
  @Put(':code')
  @UsePipes(ValidationPipe)
  async edit(@Payload() payload, @Param('code') code: string, @Body() dto: EditProjectDTO): Promise<ProjectRO> {
    return await this.projectService.edit(payload, code, dto);
  }

  // @ApiOkResponse({ description: 'Success' })
  // @Delete(':id')
  // async delete(@Param('id') id: string) {
  //   return await this.projectService.delete(id);
  // }
}
