import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseFilters,
} from '@nestjs/common';
import { GroupsService } from './group.service';
import { GroupsEntity } from './group.entity';
import { GroupNotFoundExceptionFilter } from 'src/auth/exception filter/groupnotfound.filter';
import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { EditGroupDTO } from 'src/dto/edit-group.dto';

@ApiTags('Group')
@Controller('groups')
@UseFilters(new GroupNotFoundExceptionFilter())
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @ApiOkResponse({ description: ' Get Group Success' })
  @ApiNotFoundResponse({ description: ' Group Not Found, Check Your ID' })
  @Get(':id')
  async getOneGroup(@Param('id') idGroup: number) {
    return await this.groupsService.getOneGroupOrFail(idGroup);
  }

  @Get()
  async getManyGroup() {
    return await this.groupsService.showAll();
  }

  @ApiOkResponse({ description: ' Get User In Group Success' })
  @ApiNotFoundResponse({
    description: ' Group Not Found, Check Your ID Group',
  })
  @Get(':idGroup/getAllUser')
  async getAllUser(@Param('idGroup') idGroup: number) {
    return await this.groupsService.getAllUserOfOneGroup(idGroup);
  }

  @ApiCreatedResponse({ description: ' Create  Group Success' })
  @Post()
  async createGroup(@Body() group: GroupsEntity) {
    return await this.groupsService.createGroup(group);
  }

  @ApiOkResponse({ description: ' Update Group Success' })
  @ApiNotFoundResponse({
    description: ' Group Not Found, Check Your ID Or Body Request',
  })
  @Put(':id')
  async update(@Body() group: EditGroupDTO, @Param('id') id: number) {
    return await this.groupsService.update(id, group);
  }

  @ApiOkResponse({ description: ' Delete User In Group Success' })
  @ApiNotFoundResponse({
    description: ' Group Or User Not Found, Check Your ID Group Or User',
  })
  @Delete(':idUser/deleteUser/:idGroup')
  async deleteUserInGroup(
    @Param('idUser') idUser: number,
    @Param('idGroup') idGroup: number,
  ) {
    return await this.groupsService.deleteUserInGroup(idUser, idGroup);
  }

  @ApiOkResponse({ description: ' Delete Group Success' })
  @ApiNotFoundResponse({ description: ' Group Not Found, Check Your ID' })
  @Delete(':id')
  async deleteUser(@Param('id') id: number) {
    return await this.groupsService.destroy(id);
  }
}
