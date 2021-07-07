import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  // ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ProjectService } from './project.service';
import { AddProjectDTO } from './dto/add-project.dto';
// import { EditProjectDTO } from './dto/edit-project.dto';
// import { GetProjectRO } from './ro/get-project.ro';
// import { ProjectRO } from './ro/project.ro';
import { Payload } from '../decorators/payload.decorator';

@ApiTags('Project')
@ApiNotFoundResponse({ description: 'Not Found' })
@ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
@Controller('project')
export class ProjectController {
  constructor(private projectService: ProjectService) {}

  // @ApiOkResponse({ description: 'Success' })
  // @Get('code/:code')
  // async getOneByCode(@Param('code') code: string): Promise<GetProjectRO> {
  //   const project = await this.projectService.getOneByCodeOrFail(code);
  //   return await this.projectService.getProjectResponse(project);
  // }

  // @ApiOkResponse({ description: 'Success' })
  // @Get('/:id/tasks')
  // async getAllTaskById(@Param('id') id: number): Promise<GetTaskRO[]> {
  //   return await this.projectService.getAllTaskById(id);
  // }

  // @ApiOkResponse({ description: 'Success' })
  // @Get('/:id/users')
  // async getAllUserById(@Param('id') id: number): Promise<GetUserRO[]> {
  //   return await this.projectService.getAllUserById(id);
  // }

  @ApiCreatedResponse({ description: 'Created' })
  @Post()
  @UsePipes(ValidationPipe)
  async create(@Payload() payload, @Body() dto: AddProjectDTO) {
    return await this.projectService.create(payload, dto);
  }

  // @ApiOkResponse({ description: 'Success' })
  // @Post(':code/addUser/:id')
  // async addUser(@Param('id') id: number, @Param('code') code: string): Promise<HandleUserRO> {
  //   return await this.projectService.addUser(code, id);
  // }
  //
  // @ApiOkResponse({ description: 'Success' })
  // @Post(':code/addTask/:codeTask')
  // async addTask(@Param('codeTask') codeTask: string, @Param('code') code: string): Promise<HandleTaskRO> {
  //   return await this.projectService.addTask(code, codeTask);
  // }

  // @ApiOkResponse({ description: 'Success' })
  // @Put()
  // @UsePipes(ValidationPipe)
  // async edit(@Payload() payload, @Body() dto: EditProjectDTO): Promise<ProjectRO> {
  //   return await this.projectService.edit(payload, dto);
  // }

  // @ApiOkResponse({ description: 'Success' })
  // @Delete(':id')
  // async delete(@Param('id') id: string) {
  //   return await this.projectService.delete(id);
  // }

  // @ApiOkResponse({ description: 'Success' })
  // @Delete(':code/removeUser/:id')
  // async removeUserInProject(@Param('id') idUser: number, @Param('code') code: string): Promise<HandleProjectRO> {
  //   return await this.projectService.removeUserInProject(idUser, code);
  // }
  //
  // @ApiOkResponse({ description: 'Success' })
  // @Delete(':code/removeTask/:codeTask')
  // async removeTaskInProject(@Param('codeTask') codeTask: string, @Param('code') code: string): Promise<HandleTaskRO> {
  //   return await this.projectService.removeTaskInProject(code, codeTask);
  // }
}
