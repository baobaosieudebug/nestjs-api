import { Body, Controller, Get, Param, Put, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiInternalServerErrorResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Payload } from '../decorators/payload.decorator';
import { UserService } from './user.service';
import { EditUserDTO } from './dto/edit-user.dto';
import { UserRO } from './ro/user.ro';

@ApiTags('User')
@Controller('user')
@ApiNotFoundResponse({ description: 'Not Found' })
@ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @ApiOkResponse({ description: 'Success' })
  @Get('/profile')
  async getProfile(@Payload() payload) {
    const user = await this.usersService.getOneByUsername(payload.username);
    return this.usersService.mappingSelfUserRO(user);
  }

  @ApiOkResponse({ description: 'Success' })
  @Get('/:username')
  async getInfoByUsername(@Payload() payload, @Param('username') username: string) {
    return await this.usersService.getOneWithOwner(payload, username);
  }

  @Get('/join/organization')
  async joinOrg(@Query('token') token) {
    return await this.usersService.joinOrg(token);
  }

  // @ApiOkResponse({ description: 'Success' })
  // @Get(':id')
  // async getOneById(@Param('id') id: number): Promise<GetUserRO> {
  //   const user = await this.usersService.getOneByIdOrFail(id);
  //   return this.usersService.getUserResponse(user);
  // }

  // @ApiCreatedResponse({ description: 'Created' })
  // @Post()
  // // @UsePipes(ValidationPipe)
  // async createUsers(@Body() dto: AddUserDTO): Promise<UserRO> {
  //   return await this.usersService.create(dto);
  // }

  // @ApiOkResponse({ description: 'Success' })
  // @Post(':id/assignTask/:code')
  // async assignTask(@Param('id') id: number, @Param('code') code: string): Promise<HandleTaskRO> {
  //   return await this.usersService.assignTask(id, code);
  // }

  @ApiOkResponse({ description: 'Success' })
  @Put(':id')
  @UsePipes(ValidationPipe)
  async edit(@Payload() payload, @Body() dto: EditUserDTO, @Param('id') id: number): Promise<UserRO> {
    return await this.usersService.edit(payload, id, dto);
  }
}
