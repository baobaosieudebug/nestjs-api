import { Controller, Get, Post, Put, Delete, Body, Param, UsePipes, ValidationPipe } from '@nestjs/common';
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
// import { Roles } from '../authorization/role.decorator';
// import { Role } from '../authorization/role.enum';
// import { LoginUserDTO } from './dto/login-user.dto';
// import { RolesGuard } from '../authorization/guard/role.guard';
import { GetUserRO } from './ro/get-user.ro';
import { UserRO } from './ro/user.ro';
import { HandleTaskRO } from '../task/ro/handle-task.ro';

@ApiTags('User')
@Controller('users')
@ApiNotFoundResponse({ description: 'Not Found' })
@ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOkResponse({ description: 'Success' })
  @Get(':id')
  async getOneById(@Param('id') id: number): Promise<GetUserRO> {
    const user = await this.usersService.getOneByIdOrFail(id);
    return this.usersService.getUserResponse(user);
  }

  @ApiOkResponse({ description: 'Success' })
  @Get()
  async getAll(): Promise<GetUserRO[]> {
    return await this.usersService.getAll();
  }

  @ApiCreatedResponse({ description: 'Created' })
  @Post()
  @UsePipes(ValidationPipe)
  async createUsers(@Body() dto: AddUserDTO): Promise<HandleUserRO> {
    return await this.usersService.create(dto);
  }

  @ApiOkResponse({ description: 'Success' })
  @Post(':id/assignTask/:code')
  async assignTask(@Param('id') id: number, @Param('code') code: string): Promise<HandleTaskRO> {
    return await this.usersService.assignTask(id, code);
  }

  @ApiOkResponse({ description: 'Success' })
  @Put(':id')
  @UsePipes(ValidationPipe)
  async edit(@Body() dto: EditUserDTO, @Param('id') id: number): Promise<HandleUserRO> {
    return await this.usersService.edit(id, dto);
  }

  @ApiOkResponse({ description: 'Success' })
  @Delete(':id')
  async delete(@Param('id') id: number): Promise<HandleUserRO> {
    return await this.usersService.delete(id);
  }

  // @Post('login')
  // async login(@Body() user: LoginUserDTO) {
  //   return await this.usersService.login(user);
  // }
}
