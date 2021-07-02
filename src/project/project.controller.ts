import { Body, Controller, Delete, Get, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ProjectService } from './project.service';
import { AddProjectDTO } from './dto/add-project.dto';
import { EditProjectDTO } from './dto/edit-project.dto';
import { GetProjectRO } from './ro/get-project.ro';
import { HandleProjectRO } from './ro/handle-project.ro';
import { GetTaskRO } from '../task/ro/get-task.ro';
import { GetUserRO } from '../user/ro/get-user.ro';
import { HandleTaskRO } from '../task/ro/handle-task.ro';
import { HandleUserRO } from '../user/ro/handle-user.ro';

@ApiTags('Project')
@ApiNotFoundResponse({ description: 'Not Found' })
@ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
@Controller('project')
export class ProjectController {
  constructor(private projectService: ProjectService) {}

  @ApiOkResponse({ description: 'Success' })
  @Get()
  @ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
  async getAllProject(): Promise<GetProjectRO[]> {
    return await this.projectService.getAll();
  }

  @ApiOkResponse({ description: 'Success' })
  @Get(':id')
  async getOneByIdOrFail(@Param('id') id: number): Promise<GetProjectRO> {
    const project = await this.projectService.getOneByIdOrFail(id);
    return await this.projectService.getProjectResponse(project);
  }

  @ApiOkResponse({ description: 'Success' })
  @Get('code/:code')
  async getOneByCode(@Param('code') code: string): Promise<GetProjectRO> {
    const project = await this.projectService.getOneByCodeOrFail(code);
    return await this.projectService.getProjectResponse(project);
  }

  @ApiOkResponse({ description: 'Success' })
  @Get('/:id/tasks')
  async getAllTaskById(@Param('id') id: number): Promise<GetTaskRO[]> {
    return await this.projectService.getAllTaskById(id);
  }

  @ApiOkResponse({ description: 'Success' })
  @Get('/:id/users')
  async getAllUserById(@Param('id') id: number): Promise<GetUserRO[]> {
    return await this.projectService.getAllUserById(id);
  }

  @ApiCreatedResponse({ description: 'Created' })
  @Post()
  @UsePipes(ValidationPipe)
  async create(@Body() dto: AddProjectDTO): Promise<HandleProjectRO> {
    return await this.projectService.createProject(dto);
  }

  @ApiOkResponse({ description: 'Success' })
  @Post(':code/addUser/:id')
  async addUser(@Param('id') id: number, @Param('code') code: string): Promise<HandleUserRO> {
    return await this.projectService.addUser(code, id);
  }

  @ApiOkResponse({ description: 'Success' })
  @Post(':code/addTask/:codeTask')
  async addTask(@Param('codeTask') codeTask: string, @Param('code') code: string): Promise<HandleTaskRO> {
    return await this.projectService.addTask(code, codeTask);
  }

  @ApiOkResponse({ description: 'Success' })
  @Put(':id')
  @UsePipes(ValidationPipe)
  async edit(@Body() dto: EditProjectDTO, @Param('id') id: number): Promise<HandleProjectRO> {
    return await this.projectService.edit(id, dto);
  }

  @ApiOkResponse({ description: 'Success' })
  @Delete(':id')
  async delete(@Param('id') id: number): Promise<HandleProjectRO> {
    return await this.projectService.delete(id);
  }

  @ApiOkResponse({ description: 'Success' })
  @Delete(':code/removeUser/:id')
  async removeUserInProject(@Param('id') idUser: number, @Param('code') code: string): Promise<unknown> {
    return await this.projectService.removeUserInProject(idUser, code);
  }

  @ApiOkResponse({ description: 'Success' })
  @Delete(':code/removeTask/:codeTask')
  async removeTaskInProject(@Param('codeTask') codeTask: string, @Param('code') code: string): Promise<HandleTaskRO> {
    return await this.projectService.removeTaskInProject(code, codeTask);
  }
}
