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
import { AddTaskDTO } from '../task/dto/add-task.dto';
import { EditTaskDTO } from '../task/dto/edit-task.dto';
import { TaskService } from './task.service';

@ApiTags('Task')
@Controller('task')
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

  @Get('getByCode/:codeId')
  async getOneTaskByCodeIdOrFail(@Param('codeId') codeId: string) {
    return await this.taskService.getOneByCodeIdOrFail(codeId);
  }

  @Post()
  @UsePipes(ValidationPipe)
  async createTask(@Body() dto: AddTaskDTO) {
    return await this.taskService.add(dto);
  }

  @Put(':id')
  @UsePipes(ValidationPipe)
  async editTask(@Param('id') id: number, @Body() dto: EditTaskDTO) {
    return await this.taskService.edit(id, dto);
  }

  @UseFilters(NotFoundExceptionFilter)
  @Delete(':id')
  async removeTask(@Param('id') id: number) {
    return await this.taskService.remove(id);
  }
}
