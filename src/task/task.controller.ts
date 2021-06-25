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
@ApiOkResponse({ description: 'Success' })
@ApiCreatedResponse({ description: 'Created' })
@ApiNotFoundResponse({ description: 'Not Found' })
@ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Get()
  async getAllTask() {
    return await this.taskService.getAll();
  }

  @Get(':id')
  async getTaskByIdOrFail(@Param('id') id: number) {
    return await this.taskService.getOneByIdOrFail(id);
  }

  @Get('code/:code')
  async getOneTaskByCode(@Param('code') code: string) {
    return await this.taskService.getOneByCodeOrFail(code);
  }

  @Post(':idUser')
  @UsePipes(ValidationPipe)
  async createTask(@Body() dto: AddTaskDTO, @Param('idUser') idUser: number) {
    return await this.taskService.create(dto, idUser);
  }

  @Put(':id')
  @UsePipes(ValidationPipe)
  async editTask(@Param('id') id: number, @Body() dto: EditTaskDTO) {
    return await this.taskService.edit(id, dto);
  }

  @Delete(':id')
  async removeTask(@Param('id') id: number) {
    return await this.taskService.remove(id);
  }
}
