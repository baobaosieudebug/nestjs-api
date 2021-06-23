import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
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

@ApiTags('Task')
@Controller('tasks')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Get()
  @ApiOkResponse({ description: 'Success' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server' })
  async getAllTask() {
    return await this.taskService.getAll();
  }

  @Get(':id')
  @ApiOkResponse({ description: 'Success' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server' })
  async getTaskByIdOrFail(@Param('id') id: number) {
    return await this.taskService.getOneByIdOrFail(id);
  }

  @Get('code/:code')
  @ApiOkResponse({ description: 'Success' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server' })
  async getOneTaskByCode(@Param('code') code: string) {
    return await this.taskService.getOneByCodeOrFail(code);
  }

  @Post()
  @UsePipes(ValidationPipe)
  @ApiCreatedResponse({ description: 'Success' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server' })
  async createTask(@Body() dto: AddTaskDTO) {
    return await this.taskService.create(dto);
  }

  @Put(':id')
  @UsePipes(ValidationPipe)
  @ApiOkResponse({ description: 'Success' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server' })
  async editTask(@Param('id') id: number, @Body() dto: EditTaskDTO) {
    return await this.taskService.edit(id, dto);
  }

  @Delete(':id')
  @ApiOkResponse({ description: 'Success' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server' })
  async removeTask(@Param('id') id: number) {
    return await this.taskService.remove(id);
  }
}
