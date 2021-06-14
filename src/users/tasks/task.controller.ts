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
import { AddTaskDTO } from 'src/dto/add-task.dto';
import { EditTaskDTO } from 'src/dto/edit-task.dto';
import { TaskService } from './task.service';

//Proeject mới
@ApiTags('Task')
@Controller('task')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Get()
  @ApiOkResponse({ description: 'Get List Task Success' })
  async getAllTask() {
    return await this.taskService.getAllTask();
  }

  @Get(':idGroup/getAllTask')
  @ApiOkResponse({ description: 'Get List Task Success' })
  async getAllTaskByIdGroup(@Param('idGroup') idGroup: number) {
    return await this.taskService.getAllTaskByIdGroup(idGroup);
  }

  @ApiOkResponse({ description: 'Get Task Success' })
  @ApiNotFoundResponse({ description: 'ID Task Not Found' })
  @Get(':id')
  async getTaskByIdOrFail(@Param('id') id: number) {
    return await this.taskService.getOneByIdForUser(id);
  }

  @Get('restore/:id')
  async restoreTask(@Param('id') id: number) {
    return await this.taskService.restoreTask(id);
  }

  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
  })
  @ApiUnauthorizedResponse({ description: 'You need to login ' })
  @Post()
  async createTask(@Body() task: AddTaskDTO) {
    return await this.taskService.createTask(task);
  }

  @ApiOkResponse({ description: 'Edit Task Success' })
  @Put()
  async editTask(@Body() task: EditTaskDTO) {
    return await this.taskService.editTask(task);
  }

  @ApiOkResponse({ description: 'Get Task Success' })
  @ApiNotFoundResponse({ description: 'ID Task Not Found' })
  @UseFilters(NotFoundExceptionFilter)
  @Delete(':id')
  async removeTask(@Param('id') id: number) {
    return await this.taskService.softDelte(id);
  }
}
