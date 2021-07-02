import { Body, Controller, Delete, Get, Param, Post, Put, UsePipes, ValidationPipe } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AddTaskDTO } from './dto/add-task.dto';
import { EditTaskDTO } from './dto/edit-task.dto';
import { TaskService } from './task.service';
import { GetTaskRO } from './ro/get-task.ro';
import { HandleTaskRO } from './ro/handle-task.ro';

@ApiTags('Task')
@Controller('tasks')
@ApiNotFoundResponse({ description: 'Not Found' })
@ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
export class TaskController {
  constructor(private taskService: TaskService) {}

  @ApiOkResponse({ description: 'Success' })
  @Get()
  async getAll(): Promise<GetTaskRO[]> {
    return await this.taskService.getAll();
  }

  @ApiOkResponse({ description: 'Success' })
  @Get(':id')
  async getTaskByIdOrFail(@Param('id') id: number): Promise<GetTaskRO> {
    const task = await this.taskService.getOneByIdOrFail(id);
    return this.taskService.getTaskResponse(task);
  }

  @ApiOkResponse({ description: 'Success' })
  @Get('code/:code')
  async getOneTaskByCode(@Param('code') code: string): Promise<GetTaskRO> {
    const task = await this.taskService.getOneByCodeOrFail(code);
    return this.taskService.getTaskResponse(task);
  }

  @ApiCreatedResponse({ description: 'Created' })
  @Post()
  @UsePipes(ValidationPipe)
  async createTask(@Body() dto: AddTaskDTO): Promise<HandleTaskRO> {
    return await this.taskService.create(dto);
  }

  @ApiOkResponse({ description: 'Success' })
  @Put(':id')
  @UsePipes(ValidationPipe)
  async edit(@Param('id') id: number, @Body() dto: EditTaskDTO): Promise<HandleTaskRO> {
    return await this.taskService.edit(id, dto);
  }

  @ApiOkResponse({ description: 'Success' })
  @Delete(':id')
  async remove(@Param('id') id: number): Promise<HandleTaskRO> {
    return await this.taskService.remove(id);
  }
}
