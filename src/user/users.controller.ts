import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  // UseFilters,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AddUserDTO } from './dto/add-user.dto';
// import { NotFoundExceptionFilter } from '../common/exception-filter/not-found.filter';
import {
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { EditUserDTO } from './dto/edit-user.dto';

@ApiTags('User')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  @ApiOkResponse({ description: 'Success' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server' })
  async getUser(@Param('id') id: number) {
    return await this.usersService.getOneByIdOrFail(id);
  }

  @Get()
  @ApiOkResponse({ description: 'Success' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server' })
  async getAll() {
    return await this.usersService.getAll();
  }

  @Post()
  @ApiCreatedResponse({ description: 'Success' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server' })
  @UsePipes(ValidationPipe)
  async createUsers(@Body() dto: AddUserDTO) {
    return await this.usersService.create(dto);
  }

  @Post(':id/addUserCreateTask/:code')
  @ApiOkResponse({ description: 'Success' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server' })
  async addUserCreateTask(
    @Param('id') id: number,
    @Param('code') code: string,
  ) {
    return await this.usersService.addUserCreateTask(id, code);
  }

  @Get('/:id/assignTasks')
  @ApiOkResponse({ description: 'Success' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server' })
  async getAllAssignTaskByID(@Param('id') id: number) {
    return await this.usersService.getAllAssignTaskByID(id);
  }

  @Get('/:id/createTasks')
  @ApiOkResponse({ description: 'Success' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server' })
  async getAllCreateTaskByID(@Param('id') id: number) {
    return await this.usersService.getAllCreateTaskByID(id);
  }

  @Post(':id/assignTask/:code')
  @ApiOkResponse({ description: 'Success' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server' })
  async assignTask(@Param('id') id: number, @Param('code') code: string) {
    return await this.usersService.assignTask(id, code);
  }

  @Put(':id')
  @UsePipes(ValidationPipe)
  @ApiOkResponse({ description: 'Success' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server' })
  async update(@Body() dto: EditUserDTO, @Param('id') id: number) {
    return await this.usersService.update(id, dto);
  }

  @Delete(':id')
  @ApiOkResponse({ description: 'Success' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server' })
  async removeUser(@Param('id') id: number) {
    return await this.usersService.remove(id);
  }

  @Delete(':id/removeUserCreateTask/:code')
  @ApiOkResponse({ description: 'Success' })
  @ApiNotFoundResponse({ description: 'Not Found' })
  @ApiInternalServerErrorResponse({ description: 'Internal Server' })
  async removeUserCreateTask(
    @Param('id') idUser: number,
    @Param('code') code: string,
  ) {
    return await this.usersService.removeUserCreateTask(idUser, code);
  }
}
