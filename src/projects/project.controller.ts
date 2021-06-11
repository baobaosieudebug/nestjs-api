// import { Delete, Get, Param, Put } from '@nestjs/common';
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
import { from } from 'rxjs';
import { NotFoundExceptionFilter } from 'src/auth/exception filter/not-found.filter';
import { ProjectService } from './project.service';

//Proeject mới
@ApiTags('Project')
@Controller('project')
export class ProjectController {
  constructor(private projectService: ProjectService) {}

  @Get()
  @ApiOkResponse({ description: 'Get List Article Success' })
  async getAllTask() {
    //   return await this.taskService.getAllTask();
    return 'hello';
  }

  //   @Get(':idGroup/getAllTask')
  //   @ApiOkResponse({ description: 'Get List Article Success' })
  //   async getAllTaskByIdGroup(@Param('idGroup') idGroup: number) {
  //     return await this.taskService.getAllTaskByIdGroup(idGroup);
  //   }

  //   @ApiOkResponse({ description: 'Get Task Success' })
  //   @ApiNotFoundResponse({ description: 'ID Task Not Found' })
  //   @Get(':id')
  //   async getArticleByIdOrFail(@Param('id') id: number) {
  //     return await this.taskService.getOneByIdOrFail(id);
  //   }

  //   @ApiCreatedResponse({
  //     description: 'The record has been successfully created.',
  //   })
  //   @ApiUnauthorizedResponse({ description: 'You need to login ' })
  //   @Post()
  //   async createTask(@Body() task: EditTaskDTO) {
  //     return await this.taskService.editTask(task);
  //   }

  //   @ApiOkResponse({ description: 'Edit Task Success' })
  //   @Put()
  //   async editArticle(@Body() task: EditTaskDTO) {
  //     return await this.taskService.editTask(task);
  //   }

  //   @ApiOkResponse({ description: 'Get Task Success' })
  //   @ApiNotFoundResponse({ description: 'ID Task Not Found' })
  //   @UseFilters(NotFoundExceptionFilter)
  //   @Delete(':id')
  //   async removeArticle(@Param('id') id: number) {
  //     return await this.taskService.removeTask(id);
  //   }
}
