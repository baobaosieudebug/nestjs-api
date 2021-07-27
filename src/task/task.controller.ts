import { Body, Controller, Get, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
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

  // @ApiOkResponse({ description: 'Success' })
  // @Get(':id')
  // async getTaskByIdOrFail(@Param('id') id: number): Promise<GetTaskRO> {
  //   const task = await this.taskService.getOneByIdOrFail(id);
  //   return this.taskService.mappingTaskRO(task);
  // }

  // @ApiOkResponse({ description: 'Success' })
  // @Get('code/:code')
  // async getOneTaskByCode(@Param('code') code: string): Promise<GetTaskRO> {
  //   const task = await this.taskService.getOneByCodeOrFail(code);
  //   return this.taskService.mappingTaskRO(task);
  // }

  // @ApiOkResponse({ description: 'Success' })
  // @Put(':id')
  // @UsePipes(ValidationPipe)
  // async edit(@Param('id') id: number, @Body() dto: EditTaskDTO): Promise<HandleTaskRO> {
  //   return await this.taskService.edit(id, dto);
  // }
  //
  // @ApiOkResponse({ description: 'Success' })
  // @Delete(':id')
  // async delete(@Param('id') id: number) {
  //   return await this.taskService.delete(id);
  // }
}
