import { Controller, Get, Post, Put, Delete, Body, Param, UsePipes, ValidationPipe, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AddUserDTO } from './dto/add-user.dto';
import {
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { EditUserDTO } from './dto/edit-user.dto';
import { Roles } from '../authorization/role.decorator';
import { Role } from '../authorization/role.enum';
// import { LoginUserDTO } from './dto/login-user.dto';
import { RolesGuard } from '../authorization/guard/role.guard';

@ApiTags('User')
@Controller('users')
@ApiNotFoundResponse({ description: 'Not Found' })
@ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOkResponse({ description: 'Success' })
  @Get(':id')
  async getUser(@Param('id') id: number) {
    return await this.usersService.getOneByIdOrFail(id);
  }

  @ApiOkResponse({ description: 'Success' })
  @Get()
  @UseGuards(RolesGuard)
  @Roles(Role.Admin)
  async getAll() {
    return await this.usersService.getAll();
  }

  @ApiCreatedResponse({ description: 'Created' })
  @Post()
  @UsePipes(ValidationPipe)
  async createUsers(@Body() dto: AddUserDTO) {
    return await this.usersService.create(dto);
  }

  @ApiOkResponse({ description: 'Success' })
  @Post(':id/assignTask/:code')
  async assignTask(@Param('id') id: number, @Param('code') code: string) {
    return await this.usersService.assignTask(id, code);
  }

  @ApiOkResponse({ description: 'Success' })
  @Put(':id')
  @UsePipes(ValidationPipe)
  async update(@Body() dto: EditUserDTO, @Param('id') id: number) {
    return await this.usersService.update(id, dto);
  }

  @ApiOkResponse({ description: 'Success' })
  @Delete(':id')
  async removeUser(@Param('id') id: number) {
    return await this.usersService.remove(id);
  }

  // @Post('login')
  // async login(@Body() user: LoginUserDTO) {
  //   return await this.usersService.login(user);
  // }
}
