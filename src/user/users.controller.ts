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
import { ApiTags } from '@nestjs/swagger';
import { EditUserDTO } from './dto/edit-user.dto';

@ApiTags('User')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  async getUser(@Param('id') id: number) {
    return await this.usersService.getOneByIdOrFail(id);
  }

  @Get()
  async getAll() {
    return await this.usersService.getAll();
  }
  //
  @Post()
  @UsePipes(ValidationPipe)
  async createUsers(@Body() dto: AddUserDTO) {
    return await this.usersService.create(dto);
  }

  @Post(':id/addUserCreateTask/:code')
  async addUserCreateTask(
    @Param('id') id: number,
    @Param('code') code: string,
  ) {
    return await this.usersService.addUserCreateTask(id, code);
  }

  @Post(':id/assignTask/:codeId')
  async assignTask(@Param('id') id: number, @Param('codeId') codeId: string) {
    return await this.usersService.assignTask(id, codeId);
  }

  @Put(':id')
  @UsePipes(ValidationPipe)
  async update(@Body() dto: EditUserDTO, @Param('id') id: number) {
    return await this.usersService.update(id, dto);
  }

  @Delete(':id')
  // @UseFilters(NotFoundExceptionFilter)
  async removeUser(@Param('id') id: number) {
    return await this.usersService.remove(id);
  }

  @Delete(':id/removeUserCreateTask/:code')
  async removeUserCreateTask(
    @Param('id') idUser: number,
    @Param('code') code: string,
  ) {
    return await this.usersService.removeUserCreateTask(idUser, code);
  }
}
