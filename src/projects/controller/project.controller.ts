import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseFilters,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { NotFoundExceptionFilter } from 'src/auth/exception filter/not-found.filter';
import { AddProjectDTO } from 'src/projects/dto/add-project.dto';
import { EditProjectDTO } from 'src/projects/dto/edit-project.dto';
import { ProjectService } from '../service/project.service';

//Proeject mới
@ApiTags('Project')
@Controller('project')
export class ProjectController {
  constructor(private projectService: ProjectService) {}

  @Get()
  @ApiOkResponse({ description: 'Get List Project Success' })
  async getAllProject() {
    return await this.projectService.getAllProject();
  }

  @Get(':id')
  @ApiOkResponse({ description: 'Get Project Success' })
  async getByCodeId(@Param('id') codeId: number) {
    return await this.projectService.getOneByCodeIdOrFail(codeId);
  }

  @ApiOkResponse({ description: 'Get Project Success' })
  @ApiNotFoundResponse({ description: 'ID Not Found' })
  @Get(':id')
  async getProjectByIdOrFail(@Param('id') id: number) {
    return await this.projectService.getOneByIdOrFail(id);
  }

  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
  })
  @ApiUnauthorizedResponse({ description: 'You need to login ' })
  @Post()
  async createProject(@Body() project: AddProjectDTO) {
    return await this.projectService.createProject(project);
  }

  @Post(':codeId/addGroup/:idGroup')
  async addGroup(
    @Param('codeId') codeId: number,
    @Param('idGroup') idGroup: number,
  ) {
    return await this.projectService.addGroup(codeId, idGroup);
  }

  @ApiOkResponse({ description: 'Edit Project Success' })
  @Put()
  async editProject(@Body() project: EditProjectDTO) {
    return await this.projectService.editProject(project);
  }

  @ApiOkResponse({ description: 'Get Project Success' })
  @ApiNotFoundResponse({ description: 'ID Project Not Found' })
  @UseFilters(NotFoundExceptionFilter)
  @Delete(':id')
  async removeProject(@Param('id') id: number) {
    return await this.projectService.removeProject(id);
  }
}
