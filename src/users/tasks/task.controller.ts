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
import { NotFoundExceptionFilter } from 'src/auth/exception filter/not-found.filter';
import { EditTaskDTO } from 'src/dto/edit-task.dto';
import { TaskService } from './task.service';

//Proeject mới
@ApiTags('Task')
@Controller('task')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Get()
  @ApiOkResponse({ description: 'Get List Article Success' })
  async getAllTask() {
    return await this.taskService.getAllTask();
  }

  @ApiOkResponse({ description: 'Get Task Success' })
  @ApiNotFoundResponse({ description: 'ID Task Not Found' })
  @Get(':id')
  async getArticleByIdOrFail(@Param('id') id: number) {
    return await this.taskService.getOneByIdOrFail(id);
  }

  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
  })
  @ApiUnauthorizedResponse({ description: 'You need to login ' })
  @Post()
  async createTask(@Body() task: EditTaskDTO) {
    return await this.taskService.editTask(task);
  }

  @ApiOkResponse({ description: 'Edit Task Success' })
  @Put()
  async editArticle(@Body() task: EditTaskDTO) {
    return await this.taskService.editTask(task);
  }

  @ApiOkResponse({ description: 'Get Task Success' })
  @ApiNotFoundResponse({ description: 'ID Task Not Found' })
  @UseFilters(NotFoundExceptionFilter)
  @Delete(':id')
  async removeArticle(@Param('id') id: number) {
    return await this.taskService.removeTask(id);
  }
}
