import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseFilters,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { NotFoundExceptionFilter } from '../common/exception-filter/not-found.filter';
import { AddProjectDTO } from '../project/dto/add-project.dto';
import { EditProjectDTO } from '../project/dto/edit-project.dto';
import { ProjectService } from './project.service';

@ApiTags('Project')
@Controller('project')
export class ProjectController {
  constructor(private projectService: ProjectService) {}

  @Get()
  async getAllProject() {
    return await this.projectService.getAllProject();
  }

  @Get(':id')
  async getProjectByIdOrFail(@Param('id') id: number) {
    return await this.projectService.getOneByIdOrFail(id);
  }

  @Get('codeId/:codeId')
  async getOneTaskByCodeId(@Param('codeId') codeId: string) {
    return await this.projectService.getOneByCodeIdOrFail(codeId);
  }

  @Post()
  @UsePipes(ValidationPipe)
  async createProject(@Body() dto: AddProjectDTO) {
    return await this.projectService.createProject(dto);
  }

  // @Post(':codeId/addProject/:codeIdTask')
  // async addProject(
  //   @Param('codeIdTask') codeIdTask: string,
  //   @Param('codeId') codeIdProject: string,
  // ) {
  //   return await this.projectService.addTask(codeIdProject, codeIdTask);
  // }

  @Put(':id')
  @UsePipes(ValidationPipe)
  async editProject(@Body() dto: EditProjectDTO, @Param('id') id: number) {
    return await this.projectService.editProject(id, dto);
  }

  @UseFilters(NotFoundExceptionFilter)
  @Delete(':id')
  async removeProject(@Param('id') id: number) {
    return await this.projectService.removeProject(id);
  }
}
