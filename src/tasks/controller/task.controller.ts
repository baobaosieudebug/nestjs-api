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
import { NotFoundExceptionFilter } from 'src/common/exception-filter/not-found.filter';
import { AddTaskDTO } from 'src/tasks/dto/add-task.dto';
import { EditTaskDTO } from 'src/tasks/dto/edit-task.dto';
import { TaskService } from '../service/task.service';

@ApiTags('Task')
@Controller('task')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Get()
  @ApiOkResponse({ description: 'Get List Task Success' })
  async getAllTask() {
    return await this.taskService.getAll();
  }

  // @Get(':idGroup/getAllTask')
  // @ApiOkResponse({ description: 'Get List Task Success' })
  // async getAllTaskByIdGroup(@Param('idGroup') idGroup: number) {
  //   return await this.taskService.getAllTaskByIdGroup(idGroup);
  // }

  // @ApiOkResponse({ description: 'Get Task Success' })
  // @ApiNotFoundResponse({ description: 'ID Task Not Found' })
  // @Get(':id')
  // async getTaskByIdOrFail(@Param('id') id: number) {
  //   return await this.taskService.getOneByIdForUser(id);
  // }

  @ApiOkResponse({ description: 'Get Task Success' })
  @ApiNotFoundResponse({ description: 'ID Task Not Found' })
  @Get(':id')
  async getTaskByIdOrFail(@Param('id') id: number) {
    return await this.taskService.getOneByIdOrFail(id);
  }

  // @ApiOkResponse({ description: 'Get Task Success' })
  // @ApiNotFoundResponse({ description: 'ID Task Not Found' })
  // @Get('getByCode/:codeId')
  // async getOneTaskByCodeIdOrFail(@Param('codeId') codeId: number) {
  //   return await this.taskService.getOneTaskByCodeIdOrFail(codeId);
  // }

  // @ApiCreatedResponse({
  //   description: 'The record has been successfully created.',
  // })
  // @ApiUnauthorizedResponse({ description: 'You need to login ' })
  // @Post()
  // async createTask(@Body() dto: AddTaskDTO) {
  //   return await this.taskService.createTask(dto);
  // }

  // @ApiOkResponse({ description: 'Edit Task Success' })
  // @Put(':id')
  // async editTask(@Param('id') id: number, @Body() dto: EditTaskDTO) {
  //   return await this.taskService.editTask(id, dto);
  // }

  // @ApiOkResponse({ description: 'Get Task Success' })
  // @ApiNotFoundResponse({ description: 'ID Task Not Found' })
  // @UseFilters(NotFoundExceptionFilter)
  // @Delete(':id')
  // async removeTask(@Param('id') id: number) {
  //   return await this.taskService.removeTask(id);
  // }
}
