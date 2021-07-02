import { Body, Controller, Delete, Get, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

import { AddProjectDTO } from './dto/add-project.dto';
import { EditProjectDTO } from './dto/edit-project.dto';
import { ProjectService } from './project.service';

@ApiTags('Project')
@ApiNotFoundResponse({ description: 'Not Found' })
@ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
@Controller('project')
export class ProjectController {
  constructor(private projectService: ProjectService) {}

  @ApiOkResponse({ description: 'Success' })
  @Get()
  @ApiOkResponse({ description: 'Success' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  async getAllProject() {
    return await this.projectService.getAllProject();
  }

  @ApiOkResponse({ description: 'Success' })
  @Get(':id')
  async getOneByIdOrFail(@Param('id') id: number) {
    return await this.projectService.getOneByIdOrFail(id);
  }

  @ApiOkResponse({ description: 'Success' })
  @Get('code/:code')
  async getOneTaskByCode(@Param('code') code: string) {
    return await this.projectService.getOneByCodeOrFail(code);
  }

  @ApiOkResponse({ description: 'Success' })
  @Get('/:id/tasks')
  async getAllTaskById(@Param('id') id: number) {
    return await this.projectService.getAllTaskById(id);
  }

  @ApiOkResponse({ description: 'Success' })
  @Get('/:id/users')
  async getAllUserById(@Param('id') id: number) {
    return await this.projectService.getAllUserById(id);
  }

  @ApiCreatedResponse({ description: 'Created' })
  @Post()
  @UsePipes(ValidationPipe)
  async createProject(@Body() dto: AddProjectDTO) {
    return await this.projectService.createProject(dto);
  }

  @ApiOkResponse({ description: 'Success' })
  @Post(':code/addUser/:id')
  async addUser(@Param('id') id: number, @Param('code') code: string) {
    return await this.projectService.addUser(code, id);
  }

  @ApiOkResponse({ description: 'Success' })
  @Post(':code/addTask/:codeTask')
  async addTask(@Param('codeTask') codeTask: string, @Param('code') code: string) {
    return await this.projectService.addTask(code, codeTask);
  }

  @ApiOkResponse({ description: 'Success' })
  @Put(':id')
  @UsePipes(ValidationPipe)
  async editProject(@Body() dto: EditProjectDTO, @Param('id') id: number) {
    return await this.projectService.edit(id, dto);
  }

  @ApiOkResponse({ description: 'Success' })
  @Delete(':id')
  async removeProject(@Param('id') id: number) {
    return await this.projectService.remove(id);
  }

  @ApiOkResponse({ description: 'Success' })
  @Delete(':code/removeUser/:id')
  async removeUserInProject(@Param('id') idUser: number, @Param('code') code: string) {
    return await this.projectService.removeUserInProject(idUser, code);
  }

  @ApiOkResponse({ description: 'Success' })
  @Delete(':code/removeTask/:codeTask')
  async removeTaskInProject(@Param('codeTask') codeTask: string, @Param('code') code: string) {
    return await this.projectService.removeTaskInProject(code, codeTask);
  }
}
