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
import { NotFoundExceptionFilter } from 'src/common/exception-filter/not-found.filter';
import { AddTaskDTO } from 'src/task/dto/add-task.dto';
import { EditTaskDTO } from 'src/task/dto/edit-task.dto';
import { TaskService } from './task.service';

@ApiTags('Task')
@Controller('task')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @Get()
  async getAllTask() {
    return await this.taskService.getAllTask();
  }

  @Get(':idGroup/getAllTask')
  async getAllTaskByIdGroup(@Param('idGroup') idGroup: number) {
    return await this.taskService.getAllTaskByIdGroup(idGroup);
  }

  @Get(':id')
  async getTaskByIdOrFail(@Param('id') id: number) {
    return await this.taskService.getOneByIdForUser(id);
  }

  @Get('getByCode/:codeId')
  async getOneTaskByCodeIdOrFail(@Param('codeId') codeId: number) {
    return await this.taskService.getOneTaskByCodeIdOrFail(codeId);
  }

  @Post()
  @UsePipes(ValidationPipe)
  async createTask(@Body() dto: AddTaskDTO) {
    return await this.taskService.createTask(dto);
  }

  @Put(':id')
  @UsePipes(ValidationPipe)
  async editTask(@Param('id') id: number, @Body() dto: EditTaskDTO) {
    return await this.taskService.editTask(id, dto);
  }

  @UseFilters(NotFoundExceptionFilter)
  @Delete(':id')
  async removeTask(@Param('id') id: number) {
    return await this.taskService.removeTask(id);
  }
}
