import { Body, Controller, Delete, Get, Param, Post, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Payload } from '../decorators/payload.decorator';
import { TaskService } from './task.service';
import { AddTaskDTO } from './dto/add-task.dto';
import { TaskRO } from './ro/task.ro';
import { EditTaskDTO } from './dto/edit-task.dto';

@ApiTags('Task')
@Controller('task')
@ApiNotFoundResponse({ description: 'Not Found' })
@ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
export class TaskController {
  constructor(private taskService: TaskService) {}

  @ApiOkResponse({ description: 'Success' })
  @Get()
  async getAll(@Payload() payload, @Query('projectCode') projectCode: string): Promise<TaskRO[]> {
    return await this.taskService.getAll(payload, projectCode);
  }

  @ApiCreatedResponse({ description: 'Created' })
  @Post()
  @UsePipes(ValidationPipe)
  async create(
    @Payload() payload,
    @Query('projectCode') projectCode: string,
    @Body() dto: AddTaskDTO,
  ): Promise<TaskRO> {
    return await this.taskService.create(payload, projectCode, dto);
  }

  @ApiOkResponse({ description: 'Success' })
  @Put(':id')
  @UsePipes(ValidationPipe)
  async edit(
    @Payload() payload,
    @Query('projectCode') projectCode: string,
    @Param('id') id: number,
    @Body() dto: EditTaskDTO,
  ): Promise<TaskRO> {
    return await this.taskService.edit(payload, projectCode, id, dto);
  }

  @ApiOkResponse({ description: 'Success' })
  @Delete(':code')
  async delete(@Payload() payload, @Param('code') code: string) {
    return await this.taskService.delete(payload, code);
  }
}
