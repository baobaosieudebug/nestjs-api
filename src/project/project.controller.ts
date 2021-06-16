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
import { NotFoundExceptionFilter } from 'src/common/exception-filter/not-found.filter';
import { AddProjectDTO } from 'src/project/dto/add-project.dto';
import { EditProjectDTO } from 'src/project/dto/edit-project.dto';
import { ProjectService } from './project.service';

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
  async createProject(@Body() dto: AddProjectDTO) {
    return await this.projectService.createProject(dto);
  }

  @ApiOkResponse({ description: 'Edit Project Success' })
  @Put(':id')
  async editProject(@Body() dto: EditProjectDTO, @Param('id') id: number) {
    return await this.projectService.editProject(id, dto);
  }

  @ApiOkResponse({ description: 'Get Project Success' })
  @ApiNotFoundResponse({ description: 'ID Project Not Found' })
  @UseFilters(NotFoundExceptionFilter)
  @Delete(':id')
  async removeProject(@Param('id') id: number) {
    return await this.projectService.removeProject(id);
  }
}
