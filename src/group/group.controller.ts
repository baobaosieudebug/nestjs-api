import { Controller, Get, Post, Put, Delete, Body, Param, ValidationPipe, UsePipes } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GroupsService } from './group.service';
import { EditGroupDTO } from './dto/edit-group.dto';
import { AddGroupDTO } from './dto/add-group.dto';
import { GetGroupRO } from './ro/get-group.ro';
// import { GetUserRO } from '../user/ro/get-user.ro';
// import { UserRO } from '../user/ro/user.ro';
import { HandleGroupRO } from './ro/handle-group.ro';

@ApiTags('Group')
@ApiNotFoundResponse({ description: 'Not Found' })
@ApiInternalServerErrorResponse({ description: 'Internal Server Error' })
@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @ApiOkResponse({ description: 'Success' })
  @Get(':id')
  async getOneById(@Param('id') idGroup: number): Promise<GetGroupRO> {
    const group = await this.groupsService.getOneOrFail(idGroup);
    return this.groupsService.getGroupResponse(group);
  }

  @ApiOkResponse({ description: 'Success' })
  @Get()
  async getAll(): Promise<GetGroupRO[]> {
    return await this.groupsService.getAll();
  }

  // @ApiOkResponse({ description: 'Success' })
  // @Get('/:id/users')
  // async getAllUserById(@Param('id') id: number): Promise<GetUserRO[]> {
  //   return await this.groupsService.getAllUserById(id);
  // }

  @ApiCreatedResponse({ description: 'Created' })
  @Post()
  @UsePipes(ValidationPipe)
  async createGroup(@Body() dto: AddGroupDTO): Promise<HandleGroupRO> {
    return await this.groupsService.createGroup(dto);
  }

  // @ApiOkResponse({ description: 'Success' })
  // @Post(':id/addUser/:idUser')
  // async addUser(@Param('idUser') idUser: number, @Param('id') idGroup: number): Promise<UserRO> {
  //   return await this.groupsService.addUser(idUser, idGroup);
  // }

  @ApiOkResponse({ description: 'Success' })
  @Put(':id')
  @UsePipes(ValidationPipe)
  async edit(@Body() group: EditGroupDTO, @Param('id') id: number): Promise<HandleGroupRO> {
    return await this.groupsService.edit(id, group);
  }

  @ApiOkResponse({ description: 'Success' })
  @Delete(':id')
  async delete(@Param('id') id: number): Promise<HandleGroupRO> {
    return await this.groupsService.delete(id);
  }
}
