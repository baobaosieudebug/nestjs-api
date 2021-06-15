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
import { GroupsService } from '../service/group.service';
import { GroupsEntity } from '../entity/group.entity';
import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { EditGroupDTO } from '../dto/edit-group.dto';
import { NotFoundExceptionFilter } from 'src/common/exception filter/not-found.filter';

@ApiTags('Group')
@Controller('groups')
@UseFilters(new NotFoundExceptionFilter())
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  /*---------------------------------------GET Method--------------------------------------- */

  @ApiOkResponse({ description: ' Get Group Success' })
  @ApiNotFoundResponse({ description: ' Group Not Found, Check Your ID' })
  @Get(':id')
  async getOneGroup(@Param('id') idGroup: number) {
    return await this.groupsService.getOneGroupOrFail(idGroup);
  }

  @Get()
  async getManyGroup() {
    return await this.groupsService.getAllGroup();
  }

  @ApiOkResponse({ description: ' Get User In Group Success' })
  @ApiNotFoundResponse({
    description: ' Group Not Found, Check Your ID Group',
  })
  @Get(':idGroup/getAllUser')
  async getAllUser(@Param('idGroup') idGroup: number) {
    return await this.groupsService.getAllUserOfOneGroup(idGroup);
  }

  @Get(':idGroup/getTask')
  async getAllTask(@Param('idGroup') idGroup: number) {
    return await this.groupsService.getAllTaskByIdGroup(idGroup);
  }
  /*---------------------------------------POST Method--------------------------------------- */

  @ApiCreatedResponse({ description: ' Create  Group Success' })
  @Post()
  async createGroup(@Body() group: GroupsEntity) {
    return await this.groupsService.createGroup(group);
  }

  @Post(':idGroup/addTaskByGroup/:codeId')
  async addTask(
    @Param('idGroup') idGroup: number,
    @Param('codeId') codeId: number,
  ) {
    return await this.groupsService.addTask(idGroup, codeId);
  }

  /*---------------------------------------PUT Method--------------------------------------- */
  @ApiOkResponse({ description: ' Update Group Success' })
  @ApiNotFoundResponse({
    description: ' Group Not Found, Check Your ID Or Body Request',
  })
  @Put(':id')
  async update(@Body() group: EditGroupDTO, @Param('id') id: number) {
    return await this.groupsService.update(id, group);
  }

  /*---------------------------------------DELETE Method--------------------------------------- */

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
