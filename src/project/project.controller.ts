import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  // UseFilters,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
// import { NotFoundExceptionFilter } from '../common/exception-filter/not-found.filter';
import { AddProjectDTO } from './dto/add-project.dto';
import { EditProjectDTO } from './dto/edit-project.dto';
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

  @Get('code/:code')
  async getOneTaskByCode(@Param('code') code: string) {
    return await this.projectService.getOneByCodeOrFail(code);
  }

  @Get('/:id/tasks')
  async getAllTaskByID(@Param('id') id: number) {
    return await this.projectService.getAllTaskByID(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  async createProject(@Body() dto: AddProjectDTO) {
    return await this.projectService.createProject(dto);
  }

  @Post(':code/addUser/:id')
  async addUser(@Param('id') id: number, @Param('code') code: string) {
    return await this.projectService.addUser(code, id);
  }

  @Post(':code/addTask/:codeTask')
  async addTask(
    @Param('codeTask') codeTask: string,
    @Param('code') code: string,
  ) {
    return await this.projectService.addTask(code, codeTask);
  }

  @Put(':id')
  @UsePipes(ValidationPipe)
  async editProject(@Body() dto: EditProjectDTO, @Param('id') id: number) {
    return await this.projectService.editProject(id, dto);
  }

  // @UseFilters(NotFoundExceptionFilter)
  @Delete(':id')
  async removeProject(@Param('id') id: number) {
    return await this.projectService.remove(id);
  }

  @Delete(':code/removeUser/:id')
  async removeUserInProject(
    @Param('id') idUser: number,
    @Param('code') code: string,
  ) {
    return await this.projectService.removeUserInProject(idUser, code);
  }

  @Delete(':code/removeTask/:codeTask')
  async removeTaskInProject(
    @Param('codeTask') codeTask: string,
    @Param('code') code: string,
  ) {
    return await this.projectService.removeTaskInProject(code, codeTask);
  }
}
